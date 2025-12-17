import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/formatters';
import { 
  MdRefresh, 
  MdShoppingCart, 
  MdWarning, 
  MdError,
  MdCheckCircle,
  MdEmail,
  MdDownload,
  MdAutorenew
} from 'react-icons/md';
import api from '../services/api';
import './Reorders.css';

const Reorders = () => {
  const [reorderItems, setReorderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchReorderItems();
  }, []);

  const fetchReorderItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/inventory/alerts/low-stock');
      setReorderItems(response.data);
    } catch (error) {
      console.error('Error fetching reorder items:', error);
      setError('Failed to load reorder items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(reorderItems.map(item => item._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleCreatePurchaseOrders = async () => {
    if (selectedItems.length === 0) {
      alert('Please select items to create purchase orders.');
      return;
    }

    try {
      const selectedItemsData = reorderItems.filter(item => 
        selectedItems.includes(item._id)
      );

      // Group by supplier
      const supplierGroups = selectedItemsData.reduce((groups, item) => {
        const supplierId = item.supplier?._id || 'unknown';
        if (!groups[supplierId]) {
          groups[supplierId] = [];
        }
        groups[supplierId].push(item);
        return groups;
      }, {});

      // Create purchase orders for each supplier
      const promises = Object.entries(supplierGroups).map(([supplierId, items]) => {
        const poData = {
          supplier: supplierId,
          items: items.map(item => ({
            itemId: item.itemId,
            itemName: item.itemName,
            quantity: item.reorderQuantity || (item.maximumStock - item.currentStock),
            unit: item.unit,
            unitPrice: item.unitCost || item.costPerUnit,
            totalPrice: (item.unitCost || item.costPerUnit) * (item.reorderQuantity || (item.maximumStock - item.currentStock))
          })),
          status: 'draft',
          notes: 'Auto-generated from reorder requirements'
        };

        // Calculate total amount
        poData.totalAmount = poData.items.reduce((sum, item) => sum + item.totalPrice, 0);

        return api.post('/purchase-orders', poData);
      });

      await Promise.all(promises);
      alert(`Successfully created purchase orders for ${Object.keys(supplierGroups).length} suppliers!`);
      setSelectedItems([]);
      setSelectAll(false);
      
    } catch (error) {
      console.error('Error creating purchase orders:', error);
      alert('Failed to create purchase orders. Please try again.');
    }
  };

  const handleSendReorderEmails = async () => {
    if (selectedItems.length === 0) {
      alert('Please select items to send reorder emails.');
      return;
    }

    try {
      const selectedItemsData = reorderItems.filter(item => 
        selectedItems.includes(item._id)
      );

      await api.post('/email/send-reorder-notifications', {
        items: selectedItemsData
      });

      alert('Reorder notification emails sent successfully!');
    } catch (error) {
      console.error('Error sending emails:', error);
      alert('Failed to send reorder emails. Please try again.');
    }
  };

  const exportReorderList = () => {
    const csvContent = [
      ['Item ID', 'Item Name', 'Category', 'Current Stock', 'Min Stock', 'Reorder Qty', 'Supplier', 'Status'].join(','),
      ...reorderItems.map(item => [
        item.itemId,
        item.itemName,
        item.category,
        item.currentStock,
        item.minimumStock,
        item.reorderQuantity || (item.maximumStock - item.currentStock),
        item.supplier?.name || 'N/A',
        item.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reorder-list-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusInfo = (item) => {
    if (item.currentStock <= 0) {
      return { status: 'out-of-stock', icon: <MdError />, text: 'Out of Stock', className: 'row-out-of-stock' };
    } else if (item.currentStock <= item.minimumStock * 0.5) {
      return { status: 'critical', icon: <MdWarning />, text: 'Critical', className: 'row-critical' };
    } else {
      return { status: 'low', icon: <MdWarning />, text: 'Low Stock', className: 'row-low' };
    }
  };

  const criticalItems = reorderItems.filter(item => item.currentStock <= item.minimumStock * 0.5);
  const outOfStockItems = reorderItems.filter(item => item.currentStock <= 0);
  const totalReorderValue = reorderItems.reduce((sum, item) => 
    sum + ((item.unitCost || item.costPerUnit || 0) * (item.reorderQuantity || (item.maximumStock - item.currentStock))), 0
  );

  if (loading) {
    return (
      <div className="reorders">
        <div className="page-header">
          <h2>Reorder Management</h2>
        </div>
        <div className="loading">Loading reorder items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reorders">
        <div className="page-header">
          <h2>Reorder Management</h2>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchReorderItems} className="btn btn-primary">
            <MdRefresh /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reorders">
      <div className="page-header">
        <h2>Reorder Management</h2>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchReorderItems}>
            <MdRefresh /> Refresh
          </button>
          <button className="btn btn-secondary" onClick={exportReorderList}>
            <MdDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card card-danger">
          <div className="card-content">
            <h3>Out of Stock</h3>
            <div className="card-value">{outOfStockItems.length}</div>
          </div>
          <div className="card-icon">
            <MdError />
          </div>
        </div>
        
        <div className="card card-warning">
          <div className="card-content">
            <h3>Critical Items</h3>
            <div className="card-value">{criticalItems.length}</div>
          </div>
          <div className="card-icon">
            <MdWarning />
          </div>
        </div>
        
        <div className="card card-info">
          <div className="card-content">
            <h3>Total Items</h3>
            <div className="card-value">{reorderItems.length}</div>
          </div>
          <div className="card-icon">
            <MdAutorenew />
          </div>
        </div>
        
        <div className="card card-success">
          <div className="card-content">
            <h3>Reorder Value</h3>
            <div className="card-value">{formatCurrency(totalReorderValue)}</div>
          </div>
          <div className="card-icon">
            <MdShoppingCart />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="action-section">
        <h3>Bulk Actions</h3>
        <div className="bulk-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleCreatePurchaseOrders}
            disabled={selectedItems.length === 0}
          >
            <MdShoppingCart /> Create Purchase Orders ({selectedItems.length})
          </button>
          <button 
            className="btn btn-warning" 
            onClick={handleSendReorderEmails}
            disabled={selectedItems.length === 0}
          >
            <MdEmail /> Send Reorder Emails ({selectedItems.length})
          </button>
        </div>
      </div>

      {/* Reorders Table */}
      <div className="reorders-table-container">
        {reorderItems.length > 0 ? (
          <table className="reorders-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Item Details</th>
                <th>Current Stock</th>
                <th>Min Stock</th>
                <th>Reorder Qty</th>
                <th>Supplier</th>
                <th>Est. Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reorderItems.map(item => {
                const statusInfo = getStatusInfo(item);
                const reorderQty = item.reorderQuantity || (item.maximumStock - item.currentStock);
                const estimatedCost = (item.unitCost || item.costPerUnit || 0) * reorderQty;
                
                return (
                  <tr key={item._id} className={statusInfo.className}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        onChange={() => handleSelectItem(item._id)}
                      />
                    </td>
                    <td className="item-info">
                      <div className="item-details">
                        <div className="item-name">{item.itemName}</div>
                        <div className="item-id">{item.itemId}</div>
                        <div className="item-category">{item.category}</div>
                      </div>
                    </td>
                    <td className="current-stock">
                      <div className="stock-display">
                        <span className="stock-value">{item.currentStock}</span>
                        <span className="stock-unit">{item.unit}</span>
                      </div>
                    </td>
                    <td className="min-stock">{item.minimumStock} {item.unit}</td>
                    <td className="reorder-qty">
                      <strong>{reorderQty} {item.unit}</strong>
                    </td>
                    <td className="supplier-info">
                      {item.supplier ? (
                        <div>
                          <div className="supplier-name">{item.supplier.name}</div>
                          <div className="supplier-email">{item.supplier.email}</div>
                        </div>
                      ) : (
                        <span className="no-supplier">No Supplier</span>
                      )}
                    </td>
                    <td className="estimated-cost">
                      <strong>{formatCurrency(estimatedCost)}</strong>
                    </td>
                    <td className="status">
                      <div className="status-indicator">
                        <span className={`status-icon ${statusInfo.status}`}>
                          {statusInfo.icon}
                        </span>
                        <span className={`status-text ${statusInfo.status}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-reorders">
            <MdCheckCircle size={64} color="#4caf50" />
            <h3>All Items Well Stocked!</h3>
            <p>No items currently require reordering.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reorders;