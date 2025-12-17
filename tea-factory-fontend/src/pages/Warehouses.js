import React, { useState, useEffect, useCallback } from 'react';
import {
  MdWarehouse,
  MdAdd,
  MdRefresh,
  MdEdit,
  MdDelete,
  MdInventory,
  MdLocationOn,
  MdAssessment,
  MdWarning,
  MdCheckCircle,
  MdTrendingUp,
  MdSearch,
  MdViewList,
  MdViewModule,
  MdSwapHoriz
} from 'react-icons/md';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';
import './Warehouses.css';
import { formatCurrency } from '../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseStats, setWarehouseStats] = useState({});
  const [inventoryByWarehouse, setInventoryByWarehouse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const [newWarehouse, setNewWarehouse] = useState({
    name: '',
    code: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    capacity: '',
    manager: '',
    phone: '',
    email: '',
    description: '',
    status: 'active'
  });

  const [transferData, setTransferData] = useState({
    fromWarehouse: '',
    toWarehouse: '',
    itemId: '',
    quantity: 1,
    notes: '',
    performedBy: 'admin'
  });
  const [warehouseItems, setWarehouseItems] = useState([]);

  // Define all fetch functions with useCallback BEFORE using them in useEffect
  const fetchWarehouses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching warehouses...');
      const response = await api.get('/warehouses');
      
      // Add default values for missing properties
      const warehousesWithDefaults = response.data.map(warehouse => ({
        ...warehouse,
        status: warehouse.status || 'active',
        location: warehouse.location || { address: '', city: '', state: '', zipCode: '', country: '' },
        manager: warehouse.manager || '',
        phone: warehouse.phone || '',
        email: warehouse.email || '',
        description: warehouse.description || '',
        capacity: warehouse.capacity || 0,
        inventoryCount: warehouse.inventoryCount || 0,
        totalValue: warehouse.totalValue || 0
      }));
      
      setWarehouses(warehousesWithDefaults);
      console.log('Warehouses fetched:', warehousesWithDefaults.length);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      setError('Failed to load warehouses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWarehouseStats = useCallback(async () => {
    try {
      const response = await api.get('/warehouses/stats');
      setWarehouseStats(response.data);
    } catch (error) {
      console.error('Error fetching warehouse stats:', error);
    }
  }, []);

  const fetchInventoryByWarehouse = useCallback(async () => {
    try {
      const response = await api.get('/warehouses/inventory-distribution');
      setInventoryByWarehouse(response.data);
    } catch (error) {
      console.error('Error fetching inventory distribution:', error);
    }
  }, []);

  // NOW use useEffect with the defined functions
  useEffect(() => {
    fetchWarehouses();
    fetchWarehouseStats();
    fetchInventoryByWarehouse();
  }, [fetchWarehouses, fetchWarehouseStats, fetchInventoryByWarehouse]); // Add dependencies

  const fetchWarehouseItems = async (warehouseId) => {
    if (!warehouseId) return;
    
    try {
      const response = await api.get(`/inventory/by-warehouse/${warehouseId}`);
      setWarehouseItems(response.data);
    } catch (error) {
      console.error('Error fetching warehouse items:', error);
      setWarehouseItems([]);
    }
  };

  const handleAddWarehouse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/warehouses', newWarehouse);
      setShowAddModal(false);
      setNewWarehouse({
        name: '',
        code: '',
        location: {
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA'
        },
        capacity: '',
        manager: '',
        phone: '',
        email: '',
        description: '',
        status: 'active'
      });
      fetchWarehouses();
      fetchWarehouseStats();
      fetchInventoryByWarehouse();
    } catch (error) {
      console.error('Error adding warehouse:', error);
      alert('Failed to add warehouse. Please try again.');
    }
  };

  const handleEditWarehouse = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/warehouses/${editingWarehouse._id}`, editingWarehouse);
      setShowEditModal(false);
      setEditingWarehouse(null);
      fetchWarehouses();
      fetchWarehouseStats();
      fetchInventoryByWarehouse();
    } catch (error) {
      console.error('Error updating warehouse:', error);
      alert('Failed to update warehouse. Please try again.');
    }
  };

  const handleDeleteWarehouse = async (warehouseId) => {
    if (window.confirm('Are you sure you want to delete this warehouse? This action cannot be undone.')) {
      try {
        await api.delete(`/warehouses/${warehouseId}`);
        fetchWarehouses();
        fetchWarehouseStats();
        fetchInventoryByWarehouse();
      } catch (error) {
        console.error('Error deleting warehouse:', error);
        alert('Failed to delete warehouse. Please try again.');
      }
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Change this line from api.post('/api/warehouses/transfer', transferData)
      await api.post('/warehouses/transfer', transferData);
      setShowTransferModal(false);
      fetchWarehouses();
      fetchWarehouseStats();
      fetchInventoryByWarehouse();
      alert('Inventory transferred successfully');
    } catch (error) {
      console.error('Error transferring inventory:', error);
      alert(`Failed to transfer inventory: ${error.response?.data?.message || error.message}`);
    }
  };

  const getFilteredWarehouses = () => {
    let filtered = [...warehouses];

    if (searchTerm) {
      filtered = filtered.filter(warehouse =>
        (warehouse.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (warehouse.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (warehouse.location?.city || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(warehouse => (warehouse.status || 'active') === statusFilter);
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(warehouse => (warehouse.location?.state || '') === locationFilter);
    }

    return filtered;
  };

  const getCapacityUtilization = (warehouse) => {
    const totalItems = warehouse.inventoryCount || 3000;
    const capacity = warehouse.capacity || 1;
    return Math.min((totalItems / capacity) * 100, 100);
  };

  const getCapacityStatus = (utilization) => {
    if (utilization >= 90) return 'critical';
    if (utilization >= 75) return 'warning';
    if (utilization >= 50) return 'good';
    return 'low';
  };

  const getWarehouseDistributionChart = () => {
    if (!inventoryByWarehouse.length) return { labels: [], datasets: [] };

    return {
      labels: inventoryByWarehouse.map(w => w.warehouseName || 'Unknown'),
      datasets: [{
        label: 'Items Count',
        data: inventoryByWarehouse.map(w => w.itemCount || 0),
        backgroundColor: [
          'rgba(76, 175, 80, 0.8)',
          'rgba(33, 150, 243, 0.8)',
          'rgba(255, 152, 0, 0.8)',
          'rgba(156, 39, 176, 0.8)',
          'rgba(244, 67, 54, 0.8)',
          'rgba(0, 150, 136, 0.8)',
        ],
        borderWidth: 1
      }]
    };
  };

  const getCapacityChart = () => {
    const filtered = getFilteredWarehouses();
    
    return {
      labels: filtered.map(w => w.name || 'Unknown'),
      datasets: [
        {
          label: 'Used Capacity',
          data: filtered.map(w => w.inventoryCount || 0),
          backgroundColor: 'rgba(76, 175, 80, 0.8)',
        },
        {
          label: 'Available Capacity',
          data: filtered.map(w => Math.max(0, (w.capacity || 0) - (w.inventoryCount || 0))),
          backgroundColor: 'rgba(158, 158, 158, 0.3)',
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      }
    }
  };

  if (loading) {
    return (
      <div className="warehouses">
        <div className="page-header">
          <h2>Warehouses</h2>
        </div>
        <div className="loading">Loading warehouses...</div>
      </div>
    );
  }

  return (
    <div className="warehouses">
      <div className="page-header">
        <h2><MdWarehouse /> Warehouse Management</h2>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchWarehouses}>
            <MdRefresh /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <MdAdd /> Add Warehouse
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card total">
          <div className="stat-content">
            <h3>Total Warehouses</h3>
            <div className="stat-value">{warehouseStats.total || 0}</div>
            <div className="stat-change positive">
              <MdTrendingUp />
              <span>+2 this month</span>
            </div>
          </div>
          <div className="stat-icon">
            <MdWarehouse />
          </div>
        </div>

        <div className="stat-card active">
          <div className="stat-content">
            <h3>Active Warehouses</h3>
            <div className="stat-value">{warehouseStats.active || 0}</div>
            <div className="stat-change neutral">
              <span>Operational</span>
            </div>
          </div>
          <div className="stat-icon">
            <MdCheckCircle />
          </div>
        </div>

        <div className="stat-card capacity">
          <div className="stat-content">
            <h3>Total Capacity</h3>
            <div className="stat-value">{warehouseStats.totalCapacity?.toLocaleString() || 0}</div>
            <div className="stat-change neutral">
              <span>items</span>
            </div>
          </div>
          <div className="stat-icon">
            <MdInventory />
          </div>
        </div>

        <div className="stat-card utilization">
          <div className="stat-content">
            <h3>Avg. Utilization</h3>
            <div className="stat-value">{warehouseStats.averageUtilization || 0}%</div>
            <div className="stat-change">
              {warehouseStats.averageUtilization >= 80 ? 
                <><MdWarning className="warning" /><span>High Usage</span></> :
                <><MdCheckCircle className="success" /><span>Good</span></>
              }
            </div>
          </div>
          <div className="stat-icon">
            <MdAssessment />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section" style={{background: 'transparent', padding: '0'}}>
        <div className="chart-row">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Inventory Distribution</h3>
            </div>
            <div className="chart-container">
              <Doughnut data={getWarehouseDistributionChart()} options={chartOptions} />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Capacity Utilization</h3>
            </div>
            <div className="chart-container">
              <Bar data={getCapacityChart()} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="controls-section">
        <div className="search-filter">
          <div className="search-box">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search warehouses by name, code, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              <option value="all">All Locations</option>
              <option value="CA">California</option>
              <option value="TX">Texas</option>
              <option value="NY">New York</option>
              <option value="FL">Florida</option>
            </select>
          </div>

          <div className="view-toggle">
            <button 
              className={`btn-toggle ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <MdViewModule />
            </button>
            <button 
              className={`btn-toggle ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <MdViewList />
            </button>
          </div>
        </div>
      </div>

      {/* Warehouses List/Grid */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchWarehouses} className="btn btn-primary">
            <MdRefresh /> Retry
          </button>
        </div>
      )}

      <div className={`warehouses-container ${viewMode}`}>
        {getFilteredWarehouses().length === 0 ? (
          <div className="no-warehouses">
            <MdWarehouse size={64} color="#ccc" />
            <h3>No Warehouses Found</h3>
            <p>No warehouses match your current filters or you haven't added any warehouses yet.</p>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <MdAdd /> Add First Warehouse
            </button>
          </div>
        ) : (
          getFilteredWarehouses().map(warehouse => {
            const utilization = getCapacityUtilization(warehouse);
            const capacityStatus = getCapacityStatus(utilization);

            return (
              <div className="warehouse-card" key={warehouse._id}>
                <div className="warehouse-header">
                  <h3>{warehouse.name}</h3>
                  <div className={`status-badge ${warehouse.status}`}>{warehouse.status}</div>
                </div>
                
                {/* Add capacityStatus class to show capacity visually */}
                <div className={`warehouse-details capacity-${capacityStatus}`}>
                  <div className="detail-item">
                    <MdLocationOn className="detail-icon" />
                    <span>{warehouse.location?.city || 'N/A'}, {warehouse.location?.state || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <MdInventory className="detail-icon" />
                    <span>{warehouse.inventoryCount || 0} items</span>
                  </div>
                  <div className="detail-item">
                    <MdAssessment className="detail-icon" />
                    <span>{formatCurrency(warehouse.totalValue || 0)}</span>
                  </div>
                  
                  {/* Add capacity information */}
                  <div className="detail-item capacity-info">
                    <div className="capacity-label">
                      <span>Capacity:</span>
                      <span>{warehouse.usedCapacity || 0}/{warehouse.capacity || 0} units</span>
                    </div>
                    <div className="capacity-bar">
                      <div 
                        className="capacity-fill" 
                        style={{ 
                          width: `${Math.min(100, warehouse.capacity ? (warehouse.usedCapacity / warehouse.capacity) * 100 : 0)}%`,
                          backgroundColor: warehouse.usedCapacity / warehouse.capacity > 0.9 ? '#f44336' :
                                          warehouse.usedCapacity / warehouse.capacity > 0.7 ? '#ff9800' : '#4caf50'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="warehouse-actions">
                  <button className="btn btn-icon" onClick={() => handleEditWarehouse(warehouse)}>
                    <MdEdit />
                  </button>
                  <button className="btn btn-icon delete" onClick={() => handleDeleteWarehouse(warehouse._id)}>
                    <MdDelete />
                  </button>
                  <button className="btn btn-secondary" onClick={() => {
                    setTransferData({
                      fromWarehouse: '',
                      toWarehouse: '',
                      itemId: '',
                      quantity: 1,
                      notes: '',
                      performedBy: 'admin'
                    });
                    setShowTransferModal(true);
                  }}>
                    <MdSwapHoriz /> Transfer
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Warehouse Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Warehouse</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleAddWarehouse} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Warehouse Name *</label>
                  <input
                    type="text"
                    value={newWarehouse.name}
                    onChange={(e) => setNewWarehouse({...newWarehouse, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Warehouse Code *</label>
                  <input
                    type="text"
                    value={newWarehouse.code}
                    onChange={(e) => setNewWarehouse({...newWarehouse, code: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  value={newWarehouse.location.address}
                  onChange={(e) => setNewWarehouse({
                    ...newWarehouse, 
                    location: {...newWarehouse.location, address: e.target.value}
                  })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    value={newWarehouse.location.city}
                    onChange={(e) => setNewWarehouse({
                      ...newWarehouse, 
                      location: {...newWarehouse.location, city: e.target.value}
                    })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    value={newWarehouse.location.state}
                    onChange={(e) => setNewWarehouse({
                      ...newWarehouse, 
                      location: {...newWarehouse.location, state: e.target.value}
                    })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Zip Code</label>
                  <input
                    type="text"
                    value={newWarehouse.location.zipCode}
                    onChange={(e) => setNewWarehouse({
                      ...newWarehouse, 
                      location: {...newWarehouse.location, zipCode: e.target.value}
                    })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Capacity *</label>
                  <input
                    type="number"
                    value={newWarehouse.capacity}
                    onChange={(e) => setNewWarehouse({...newWarehouse, capacity: parseInt(e.target.value) || 0})}
                    required
                    min="1"
                  />
                  <small className="form-text">Maximum storage capacity in units</small>
                </div>
                <div className="form-group">
                  <label>Used Capacity</label>
                  <input
                    type="number"
                    value={newWarehouse.usedCapacity || 0}
                    onChange={(e) => setNewWarehouse({...newWarehouse, usedCapacity: parseInt(e.target.value) || 0})}
                    min="0"
                    max={newWarehouse.capacity}
                  />
                  <small className="form-text">Current usage (auto-calculated from inventory)</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Manager</label>
                  <input
                    type="text"
                    value={newWarehouse.manager}
                    onChange={(e) => setNewWarehouse({...newWarehouse, manager: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={newWarehouse.phone}
                    onChange={(e) => setNewWarehouse({...newWarehouse, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newWarehouse.email}
                    onChange={(e) => setNewWarehouse({...newWarehouse, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newWarehouse.description}
                  onChange={(e) => setNewWarehouse({...newWarehouse, description: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={newWarehouse.status}
                  onChange={(e) => setNewWarehouse({...newWarehouse, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Warehouse Modal */}
      {showEditModal && editingWarehouse && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Warehouse</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleEditWarehouse} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Warehouse Name *</label>
                  <input
                    type="text"
                    value={editingWarehouse.name || ''}
                    onChange={(e) => setEditingWarehouse({...editingWarehouse, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Warehouse Code *</label>
                  <input
                    type="text"
                    value={editingWarehouse.code || ''}
                    onChange={(e) => setEditingWarehouse({...editingWarehouse, code: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  value={editingWarehouse.location?.address || ''}
                  onChange={(e) => setEditingWarehouse({
                    ...editingWarehouse, 
                    location: {...(editingWarehouse.location || {}), address: e.target.value}
                  })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    value={editingWarehouse.location?.city || ''}
                    onChange={(e) => setEditingWarehouse({
                      ...editingWarehouse, 
                      location: {...(editingWarehouse.location || {}), city: e.target.value}
                    })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    value={editingWarehouse.location?.state || ''}
                    onChange={(e) => setEditingWarehouse({
                      ...editingWarehouse, 
                      location: {...(editingWarehouse.location || {}), state: e.target.value}
                    })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Zip Code</label>
                  <input
                    type="text"
                    value={editingWarehouse.location?.zipCode || ''}
                    onChange={(e) => setEditingWarehouse({
                      ...editingWarehouse, 
                      location: {...(editingWarehouse.location || {}), zipCode: e.target.value}
                    })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Capacity *</label>
                  <input
                    type="number"
                    value={editingWarehouse?.capacity || 0}
                    onChange={(e) => setEditingWarehouse({
                      ...editingWarehouse, 
                      capacity: parseInt(e.target.value) || 0
                    })}
                    required
                    min="1"
                  />
                  <small className="form-text">Maximum storage capacity in units</small>
                </div>
                <div className="form-group">
                  <label>Used Capacity</label>
                  <input
                    type="number"
                    value={editingWarehouse?.usedCapacity || 0}
                    disabled={true}
                    title="Used capacity is automatically calculated from inventory"
                  />
                  <small className="form-text">Current usage (calculated from inventory)</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Manager</label>
                  <input
                    type="text"
                    value={editingWarehouse.manager || ''}
                    onChange={(e) => setEditingWarehouse({...editingWarehouse, manager: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={editingWarehouse.phone || ''}
                    onChange={(e) => setEditingWarehouse({...editingWarehouse, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editingWarehouse.email || ''}
                    onChange={(e) => setEditingWarehouse({...editingWarehouse, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingWarehouse.description || ''}
                  onChange={(e) => setEditingWarehouse({...editingWarehouse, description: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={editingWarehouse.status || 'active'}
                  onChange={(e) => setEditingWarehouse({...editingWarehouse, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Inventory Modal */}
      {showTransferModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Transfer Inventory</h3>
              <button className="close-btn" onClick={() => setShowTransferModal(false)}>×</button>
            </div>
            <form onSubmit={handleTransferSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>From Warehouse *</label>
                  <select
                    value={transferData.fromWarehouse}
                    onChange={(e) => {
                      setTransferData({...transferData, fromWarehouse: e.target.value});
                      fetchWarehouseItems(e.target.value);
                    }}
                    required
                  >
                    <option value="">Select Source Warehouse</option>
                    {warehouses.map(warehouse => (
                      <option key={warehouse._id} value={warehouse._id}>
                        {warehouse.name} ({warehouse.code})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>To Warehouse *</label>
                  <select
                    value={transferData.toWarehouse}
                    onChange={(e) => setTransferData({...transferData, toWarehouse: e.target.value})}
                    required
                  >
                    <option value="">Select Destination Warehouse</option>
                    {warehouses
                      .filter(w => w._id !== transferData.fromWarehouse)
                      .map(warehouse => (
                        <option key={warehouse._id} value={warehouse._id}>
                          {warehouse.name} ({warehouse.code})
                        </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Item *</label>
                  <select
                    value={transferData.itemId}
                    onChange={(e) => {
                      const item = warehouseItems.find(item => item.itemId === e.target.value);
                      setTransferData({
                        ...transferData, 
                        itemId: e.target.value,
                        quantity: 1,
                        maxQuantity: item?.currentStock || 0
                      });
                    }}
                    required
                    disabled={!transferData.fromWarehouse || warehouseItems.length === 0}
                  >
                    <option value="">Select Item</option>
                    {warehouseItems.map(item => (
                      <option key={item._id} value={item.itemId}>
                        {item.itemName} ({item.itemId}) - {item.currentStock} {item.unit} available
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    value={transferData.quantity}
                    onChange={(e) => setTransferData({...transferData, quantity: parseInt(e.target.value) || 0})}
                    min="1"
                    max={transferData.maxQuantity}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={transferData.notes}
                  onChange={(e) => setTransferData({...transferData, notes: e.target.value})}
                  placeholder="Optional transfer notes"
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowTransferModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Transfer Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouses;