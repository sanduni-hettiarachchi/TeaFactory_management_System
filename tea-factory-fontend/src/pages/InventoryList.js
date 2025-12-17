import React, { useState, useEffect, useCallback } from 'react'; // Add useCallback
import { formatCurrency } from '../utils/formatters';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete,
  MdSearch,
  MdFilterList,
  MdRefresh,
  MdWarning,
  MdCheckCircle,
  MdError,
  MdTrendingUp,
  MdTrendingDown,
  MdClose,
  MdSave
} from 'react-icons/md';
import api from '../services/api';
import './InventoryList.css';

const InventoryList = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [stockUpdateItem, setStockUpdateItem] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    itemId: '',    
    itemName: '',
    description: '',
    category: '',
    unit: 'kg',
    currentStock: 0,
    minimumStock: 0,
    maximumStock: 0,
    unitCost: 0,
    sellingPrice: 0,
    location: {
      warehouse: '',
      shelf: '',
      row: ''
    },
    supplier: ''
  });

  // Stock update form
  const [stockForm, setStockForm] = useState({
    type: 'receive',
    quantity: 0,
    notes: '',
    performedBy: 'admin'
  });

  // Unique filter values
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    warehouses: [],
    suppliers: []
  });

  const [warehouses, setWarehouses] = useState([]);

  // Define fetchInventoryItems with useCallback BEFORE useEffect that uses it
  const fetchInventoryItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/inventory');
      const items = response.data;
      
      setInventoryItems(items);
      setFilteredItems(items);
      
      // Extract unique filter options
      const categories = [...new Set(items.map(item => item.category).filter(Boolean))];
      const warehouseOptions = [];
      
      // Create warehouse filter options from populated warehouse objects
      items.forEach(item => {
        if (item.location?.warehouse && typeof item.location.warehouse === 'object') {
          const warehouse = item.location.warehouse;
          if (warehouse._id && !warehouseOptions.some(w => w.id === warehouse._id)) {
            warehouseOptions.push({
              id: warehouse._id,
              name: warehouse.name || warehouse.code || 'Unknown'
            });
          }
        }
      });
      
      setFilterOptions(prev => ({
        ...prev,
        categories,
        warehouses: warehouseOptions
      }));
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      setError('Failed to load inventory items. Please try again.');
      setLoading(false);
    }
  }, []);  // Empty dependency array for initial load

  // Define fetchWarehouses with useCallback
  const fetchWarehouses = useCallback(async () => {
    try {
      const response = await api.get('/warehouses');
      // Add remaining capacity information
      const warehousesWithCapacity = response.data.map(warehouse => ({
        ...warehouse,
        remainingCapacity: warehouse.capacity - (warehouse.usedCapacity || 0)
      }));
      setWarehouses(warehousesWithCapacity);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  }, []);

  // Define fetchSuppliers with useCallback
  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await api.get('/suppliers');
      setFilterOptions(prev => ({
        ...prev,
        suppliers: response.data
      }));
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  }, []);

  // NOW use useEffect with the defined functions
  useEffect(() => {
    fetchInventoryItems();
    fetchWarehouses();
    fetchSuppliers();
  }, [fetchInventoryItems, fetchWarehouses, fetchSuppliers]); // Add dependencies

  // Filters and search
  const applyFilters = useCallback(() => {
    let filtered = inventoryItems;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Warehouse filter
    if (warehouseFilter !== 'all') {
      filtered = filtered.filter(item => 
        item.location?.warehouse?._id === warehouseFilter || 
        item.location?.warehouse === warehouseFilter
      );
    }

    setFilteredItems(filtered);
  }, [inventoryItems, searchTerm, categoryFilter, statusFilter, warehouseFilter]);

  const handleAddItem = () => {
    setEditingItem(null);
    resetForm();
    
    // Generate a unique item ID based on timestamp and random number
    const randomId = Math.floor(Math.random() * 10000);
    const newItemId = `ITEM-${Date.now().toString().substring(9)}-${randomId}`;
    
    setFormData(prev => ({
      ...prev,
      itemId: newItemId
    }));
    
    setShowModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      itemId: item.itemId || '', // Add this line
      itemName: item.itemName || '',
      description: item.description || '',
      category: item.category || '',
      unit: item.unit || 'kg',
      currentStock: item.currentStock || 0,
      minimumStock: item.minimumStock || 0,
      maximumStock: item.maximumStock || 0,
      unitCost: item.unitCost || 0,
      sellingPrice: item.sellingPrice || 0,
      location: {
        warehouse: item.location?.warehouse || '',
        shelf: item.location?.shelf || '',
        row: item.location?.row || ''
      },
      supplier: item.supplier?._id || ''
    });
    setShowModal(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        await api.delete(`/inventory/${itemId}`);
        alert('Item deleted successfully!');
        fetchInventoryItems();
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Find selected warehouse
      const selectedWarehouse = warehouses.find(w => w._id === formData.location.warehouse);
      
      // For new items, validate against warehouse capacity
      if (!editingItem && selectedWarehouse && formData.currentStock > selectedWarehouse.remainingCapacity) {
        if (!window.confirm(`Warning: Adding ${formData.currentStock} ${formData.unit} exceeds warehouse's remaining capacity of ${selectedWarehouse.remainingCapacity} units. Continue anyway?`)) {
          return;
        }
      }
      
      // For editing items, only check the difference if warehouse didn't change
      if (editingItem && 
          selectedWarehouse && 
          editingItem.location?.warehouse?._id === formData.location.warehouse) {
        const stockDifference = formData.currentStock - editingItem.currentStock;
        if (stockDifference > 0 && stockDifference > selectedWarehouse.remainingCapacity) {
          if (!window.confirm(`Warning: Adding ${stockDifference} more ${formData.unit} exceeds warehouse's remaining capacity of ${selectedWarehouse.remainingCapacity} units. Continue anyway?`)) {
            return;
          }
        }
      }
      
      const payload = {
        ...formData,
        location: {
          ...formData.location,
          warehouse: formData.location.warehouse || null
        },
        supplier: formData.supplier || null
      };

      if (editingItem) {
        await api.put(`/inventory/${editingItem._id}`, payload);
      } else {
        await api.post('/inventory', payload);
      }

      setShowModal(false);
      fetchInventoryItems();
      fetchWarehouses(); // Refresh warehouses to update capacity
      resetForm();
    } catch (error) {
      console.error('Error saving item:', error);
      alert(`Error saving item: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleStockUpdate = (item) => {
    setStockUpdateItem(item);
    setStockForm({
      type: 'receive',
      quantity: 0,
      notes: '',
      performedBy: 'admin'
    });
    setShowStockModal(true);
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    try {
      // Remove or use the response variable
      await api.post(`/inventory/${stockUpdateItem.itemId}/update-stock`, stockForm);
      
      setShowStockModal(false);
      fetchInventoryItems();
      fetchWarehouses();
      
      // Success notification
      alert(`Stock ${stockForm.type === 'receive' ? 'received' : 'issued'} successfully`);
    } catch (error) {
      console.error('Error updating stock:', error);
      alert(`Error updating stock: ${error.response?.data?.message || error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      itemId: '', // Add this line
      itemName: '',
      description: '',
      category: '',
      unit: 'kg',
      currentStock: 0,
      minimumStock: 0,
      maximumStock: 0,
      unitCost: 0,
      sellingPrice: 0,
      location: {
        warehouse: '',
        shelf: '',
        row: ''
      },
      supplier: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_stock':
        return <MdCheckCircle className="status-icon success" />;
      case 'low_stock':
        return <MdWarning className="status-icon warning" />;
      case 'out_of_stock':
        return <MdError className="status-icon danger" />;
      default:
        return <MdCheckCircle className="status-icon" />;
    }
  };

  const getStockTrend = (current, minimum) => {
    const percentage = (current / minimum) * 100;
    if (percentage > 150) return <MdTrendingUp className="trend-icon positive" />;
    if (percentage < 80) return <MdTrendingDown className="trend-icon negative" />;
    return null;
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, categoryFilter, statusFilter, warehouseFilter, inventoryItems, applyFilters]);

  if (loading) {
    return (
      <div className="inventory-list">
        <div className="page-header">
          <h2 style={{backgroundColor: 'transparent'}}>Inventory Management</h2>
        </div>
        <div className="loading">Loading inventory items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inventory-list">
        <div className="page-header">
          <h2>Inventory Management</h2>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchInventoryItems} className="btn btn-primary">
            <MdRefresh /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-list">
      <div className="page-header">
        <h2>Inventory Management</h2>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAddItem}>
            <MdAdd /> Add New Item
          </button>
          <button className="btn btn-outline" onClick={fetchInventoryItems}>
            <MdRefresh /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <div className="card-content">
            <h3>Total Items</h3>
            <div className="card-value">{inventoryItems.length}</div>
          </div>
        </div>
        <div className="card card-success">
          <div className="card-content">
            <h3>In Stock</h3>
            <div className="card-value">
              {inventoryItems.filter(item => item.status === 'in_stock').length}
            </div>
          </div>
        </div>
        <div className="card card-warning">
          <div className="card-content">
            <h3>Low Stock</h3>
            <div className="card-value">
              {inventoryItems.filter(item => item.status === 'low_stock').length}
            </div>
          </div>
        </div>
        <div className="card card-danger">
          <div className="card-content">
            <h3>Out of Stock</h3>
            <div className="card-value">
              {inventoryItems.filter(item => item.status === 'out_of_stock').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-box">
          <div className="search-input-wrapper">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search items by name, ID, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div 
          className="filter-controls"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '15px',
            flexWrap: 'wrap'
          }}
        >
          <div 
            className="filter-group"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <MdFilterList className="filter-icon" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {filterOptions.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div 
            className="filter-group"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          <div 
            className="filter-group"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Warehouses</option>
              {filterOptions.warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="inventory-table-container">
        {filteredItems.length > 0 ? (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Location</th>
                <th>Supplier</th>
                <th>Unit Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item._id} className={`row-${item.status}`}>
                  <td className="item-id">{item.itemId}</td>
                  <td className="item-name">
                    <div className="item-info">
                      <strong>{item.itemName}</strong>
                      {item.description && (
                        <small className="item-description">{item.description}</small>
                      )}
                    </div>
                  </td>
                  <td className="category">{item.category}</td>
                  <td className="stock-info">
                    <div className="stock-details">
                      <span className="current-stock">{item.currentStock}</span>
                      <small className="stock-limits">
                        Min: {item.minimumStock} | Max: {item.maximumStock}
                      </small>
                      {getStockTrend(item.currentStock, item.minimumStock)}
                    </div>
                  </td>
                  <td>{item.unit}</td>
                  <td>
                    <div className="status-cell">
                      {getStatusIcon(item.status)}
                      <span className={`status-text ${item.status}`}>
                        {item.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="location">
                    <div className="location-info">
                      <strong>
                        {item.location?.warehouse?.name || 
                         (item.location?.warehouse ? 
                          (typeof item.location.warehouse === 'object' ? 
                            item.location.warehouse.code : 'Unknown') : 
                          'Not Assigned')}
                      </strong>
                      <small>{item.location?.shelf || '-'}-{item.location?.row || '-'}</small>
                    </div>
                  </td>
                  <td className="supplier">{item.supplier?.name || 'N/A'}</td>
                  <td className="cost">{item.unitCost ? formatCurrency(item.unitCost) : 'N/A'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-small btn-info"
                        onClick={() => handleEditItem(item)}
                        title="Edit Item"
                      >
                        <MdEdit />
                      </button>
                      <button
                        className="btn-small btn-success"
                        onClick={() => handleStockUpdate(item)}
                        title="Update Stock"
                      >
                        <MdTrendingUp />
                      </button>
                      <button
                        className="btn-small btn-danger"
                        onClick={() => handleDeleteItem(item.itemId)}
                        title="Delete Item"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">
            <p>No inventory items found matching your criteria.</p>
            <button className="btn btn-primary" onClick={handleAddItem}>
              <MdAdd /> Add Your First Item
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Item Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <MdClose />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="item-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Item ID *</label>
                  <input
                    type="text"
                    value={formData.itemId}
                    onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                    required
                    disabled={editingItem} // Don't allow changing itemId when editing
                  />
                </div>

                <div className="form-group">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="boxes">Boxes</option>
                    <option value="liters">Liters</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Supplier</label>
                  <select
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  >
                    <option value="">Select Supplier</option>
                    {filterOptions.suppliers.map(supplier => (
                      <option key={supplier._id} value={supplier._id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Current Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label>Minimum Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minimumStock}
                    onChange={(e) => setFormData({ ...formData, minimumStock: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label>Maximum Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maximumStock}
                    onChange={(e) => setFormData({ ...formData, maximumStock: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label>Unit Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unitCost}
                    onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label>Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="location-group">
                <h4>Location Details</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Warehouse *</label>
                    <select
                      value={formData.location.warehouse || ''}
                      onChange={(e) => {
                        const warehouseId = e.target.value;
                        const selectedWarehouse = warehouses.find(w => w._id === warehouseId);
                        
                        // Show warning if quantity exceeds capacity
                        if (selectedWarehouse && formData.currentStock > selectedWarehouse.remainingCapacity) {
                          alert(`Warning: Current stock (${formData.currentStock} ${formData.unit}) exceeds warehouse's remaining capacity (${selectedWarehouse.remainingCapacity} units).`);
                        }
                        
                        setFormData({
                          ...formData,
                          location: { ...formData.location, warehouse: warehouseId }
                        });
                      }}
                      required
                    >
                      <option value="">Select Warehouse</option>
                      {warehouses.map(warehouse => (
                        <option 
                          key={warehouse._id} 
                          value={warehouse._id} 
                          disabled={warehouse.remainingCapacity <= 0 && !editingItem}
                        >
                          {warehouse.name} ({warehouse.code}) - {warehouse.remainingCapacity} units available
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Shelf</label>
                    <input
                      type="text"
                      value={formData.location.shelf}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        location: { ...formData.location, shelf: e.target.value }
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Row</label>
                    <input
                      type="text"
                      value={formData.location.row}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        location: { ...formData.location, row: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <MdSave /> {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Update Modal */}
      {showStockModal && (
        <div className="modal-overlay" onClick={() => setShowStockModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Stock - {stockUpdateItem?.itemName}</h3>
              <button className="close-btn" onClick={() => setShowStockModal(false)}>
                <MdClose />
              </button>
            </div>
            
            <form onSubmit={handleUpdateStock} className="stock-form">
              <div className="current-stock-info">
                <p><strong>Current Stock:</strong> {stockUpdateItem?.currentStock} {stockUpdateItem?.unit}</p>
                <p><strong>Status:</strong> 
                  <span className={`status-badge ${stockUpdateItem?.status}`}>
                    {stockUpdateItem?.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </p>
              </div>

              <div className="form-group">
                <label>Transaction Type</label>
                <select
                  value={stockForm.type}
                  onChange={(e) => setStockForm({ ...stockForm, type: e.target.value })}
                  required
                >
                  <option value="receive">Receive Stock</option>
                  <option value="issue">Issue/Sell Stock</option>
                  <option value="adjustment">Stock Adjustment</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  {stockForm.type === 'adjustment' ? 'New Stock Level' : 'Quantity'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockForm.quantity}
                  onChange={(e) => setStockForm({ ...stockForm, quantity: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={stockForm.notes}
                  onChange={(e) => setStockForm({ ...stockForm, notes: e.target.value })}
                  placeholder="Add notes about this stock transaction..."
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowStockModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <MdSave /> Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;