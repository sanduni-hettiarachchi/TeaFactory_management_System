import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './PurchaseOrders.css';

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/suppliers/purchase-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (orderId, newStatus, reason = '') => {
    try {
      const updateData = { status: newStatus };
      if (reason) {
        updateData.notes = reason;
      }

      await api.put(`/suppliers/purchase-orders/${orderId}`, updateData);
      alert(`Order ${newStatus} successfully!`);
      fetchOrders();
      setShowDetailsModal(false);
    } catch (error) {
      console.error(`Error updating order status:`, error);
      alert(`Failed to ${newStatus} order`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'draft': '#9e9e9e',
      'pending': '#ff9800',
      'approved': '#4caf50',
      'sent': '#2196f3',
      'received': '#00bcd4',
      'cancelled': '#f44336'
    };
    return colors[status] || '#9e9e9e';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
        <div className="modal order-details-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Purchase Order Details - {selectedOrder.poNumber}</h3>
            <button 
              className="close-btn"
              onClick={() => setShowDetailsModal(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="modal-content">
            <div className="order-summary">
              <div className="summary-row">
                <div className="summary-item">
                  <label>Supplier:</label>
                  <span>{selectedOrder.supplier?.name || 'Unknown'}</span>
                </div>
                <div className="summary-item">
                  <label>Status:</label>
                  <span 
                    className={`status-badge ${selectedOrder.status}`}
                    style={{ backgroundColor: getStatusColor(selectedOrder.status) + '20' }}
                  >
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="summary-row">
                <div className="summary-item">
                  <label>Total Amount:</label>
                  <span className="amount">{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
                <div className="summary-item">
                  <label>Expected Delivery:</label>
                  <span>
                    {selectedOrder.expectedDeliveryDate 
                      ? new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString()
                      : 'Not specified'
                    }
                  </span>
                </div>
              </div>
              
              <div className="summary-row">
                <div className="summary-item">
                  <label>Requested By:</label>
                  <span>{selectedOrder.requestedBy}</span>
                </div>
                <div className="summary-item">
                  <label>Created:</label>
                  <span>{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="order-items">
              <h4>Order Items</h4>
              <div className="items-table">
                <table>
                  <thead>
                    <tr>
                      <th>Item ID</th>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.itemId}</td>
                        <td>{item.itemName}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.unitPrice)}</td>
                        <td>{formatCurrency(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="order-notes">
                <h4>Notes</h4>
                <p>{selectedOrder.notes}</p>
              </div>
            )}

            <div className="order-actions">
              {selectedOrder.status === 'pending' && (
                <>
                  <button 
                    className="btn btn-success"
                    onClick={() => handleStatusChange(selectedOrder._id, 'approved')}
                  >
                    ✅ Approve Order
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => {
                      const reason = prompt('Please provide a reason for rejection:');
                      if (reason) {
                        handleStatusChange(selectedOrder._id, 'cancelled', reason);
                      }
                    }}
                  >
                    ❌ Reject Order
                  </button>
                </>
              )}
              
              {selectedOrder.status === 'approved' && (
                <button 
                  className="btn btn-info"
                  onClick={() => handleStatusChange(selectedOrder._id, 'sent')}
                >
                  📧 Mark as Sent
                </button>
              )}
              
              {selectedOrder.status === 'sent' && (
                <button 
                  className="btn btn-success"
                  onClick={() => handleStatusChange(selectedOrder._id, 'received')}
                >
                  📦 Mark as Received
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="purchase-orders">
        <div className="page-header">
          <h2>Purchase Orders</h2>
        </div>
        <div className="loading">Loading purchase orders...</div>
      </div>
    );
  }

  return (
    <div className="purchase-orders">
      <div className="page-header">
        <h2>Purchase Orders</h2>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={fetchOrders}>
            🔄 Refresh
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => window.location.href = '/suppliers/dashboard'}
          >
            📊 Dashboard
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by PO number or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-box">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="sent">Sent</option>
            <option value="received">Received</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="orders-grid">
        {filteredOrders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="po-number">{order.poNumber}</div>
              <div 
                className={`status-badge ${order.status}`}
                style={{ backgroundColor: getStatusColor(order.status) + '20' }}
              >
                {order.status.toUpperCase()}
              </div>
            </div>
            
            <div className="order-info">
              <div className="info-row">
                <span className="label">Supplier:</span>
                <span className="value">{order.supplier?.name || 'Unknown'}</span>
              </div>
              <div className="info-row">
                <span className="label">Total:</span>
                <span className="value amount">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="info-row">
                <span className="label">Items:</span>
                <span className="value">{order.items.length} items</span>
              </div>
              <div className="info-row">
                <span className="label">Expected:</span>
                <span className="value">
                  {order.expectedDeliveryDate 
                    ? new Date(order.expectedDeliveryDate).toLocaleDateString()
                    : 'Not specified'
                  }
                </span>
              </div>
            </div>
            
            <div className="order-actions">
              <button 
                className="btn btn-sm btn-info"
                onClick={() => {
                  setSelectedOrder(order);
                  setShowDetailsModal(true);
                }}
              >
                View Details
              </button>
              
              {order.status === 'pending' && (
                <div className="quick-actions">
                  <button 
                    className="btn btn-sm btn-success"
                    onClick={() => handleStatusChange(order._id, 'approved')}
                  >
                    Approve
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      const reason = prompt('Reason for rejection:');
                      if (reason) {
                        handleStatusChange(order._id, 'cancelled', reason);
                      }
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="no-data">
          <div className="no-data-icon">📦</div>
          <h3>No Purchase Orders Found</h3>
          <p>No purchase orders match your current filters.</p>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && <OrderDetailsModal />}
    </div>
  );
};

export default PurchaseOrders;