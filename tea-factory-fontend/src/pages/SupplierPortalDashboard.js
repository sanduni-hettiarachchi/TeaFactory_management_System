import React, { useState, useEffect, useCallback } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { 
  MdShoppingCart, 
  MdPendingActions, 
  MdLocalShipping, 
  MdDoneAll, 
  MdCancel,
  MdAttachMoney,
  MdInventory, 
  MdAccessTime,
  MdRefresh,
  MdVisibility,
  MdFilterList,
  MdWarning,
  MdCheck
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './SupplierDashboard.css'; // Reuse existing styles
import './SupplierPortal.css'; // Supplier-specific styles
import Layout from '../components/Layout';
import { useAuth } from '../contex/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SupplierPortalDashboard = () => {
  const { currentUser } = useAuth();
  const supplierId = currentUser?.id;
  
  const [dashboardData, setDashboardData] = useState({
    supplier: {
      id: '',
      name: '',
      status: '',
      contactPerson: '',
      email: '',
      phone: '',
      leadTime: 0,
      registeredSince: ''
    },
    summary: {
      totalOrders: 0,
      pendingApproval: 0,
      inProgress: 0,
      completed: 0,
      rejected: 0,
      totalOrderValue: 0,
      suppliedItems: 0,
      onTimeDeliveryPercentage: 0
    },
    recentOrders: [],
    suppliedItems: [],
    ordersByStatus: {
      pending: 0,
      approved: 0,
      delivered: 0,
      rejected: 0
    },
    monthlyOrderData: [],
    performance: {
      onTimeDelivery: 0,
      averageLeadTime: 'N/A'
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeOrderTab, setActiveOrderTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const fetchSupplierDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/suppliers/dashboard/${supplierId}`);
      setDashboardData(response.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching supplier dashboard:', error);
      setError('Failed to load your dashboard. Please try again.');
      setLoading(false);
    }
  }, [supplierId]);
  
  useEffect(() => {
    if (supplierId) {
      fetchSupplierDashboard();
    }
  }, [supplierId, fetchSupplierDashboard]);
  
  // Filter orders based on active tab
  const getFilteredOrders = () => {
    if (!dashboardData.recentOrders) return [];
    
    let filteredOrders = [...dashboardData.recentOrders];
    
    // Apply status filter
    if (activeOrderTab !== 'all') {
      // Map the UI tab names to actual status values in the database
      const statusMap = {
        'pending': 'pending',
        'approved': 'approved',
        'delivered': ['completed', 'received'], // Handle both status values
        'rejected': 'cancelled'
      };
      
      const statusValue = statusMap[activeOrderTab];
      
      if (Array.isArray(statusValue)) {
        filteredOrders = filteredOrders.filter(order => statusValue.includes(order.status));
      } else {
        filteredOrders = filteredOrders.filter(order => order.status === statusValue);
      }
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filteredOrders = filteredOrders.filter(order => 
        order.poNumber.toLowerCase().includes(search) ||
        (order.notes && order.notes.toLowerCase().includes(search))
      );
    }
    
    return filteredOrders;
  };
  
  if (loading) {
    return (
      <div className="supplier-dashboard">
        <div className="dashboard-header">
          <h2>My Supplier Dashboard</h2>
        </div>
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="supplier-dashboard">
        <div className="dashboard-header">
          <h2>My Supplier Dashboard</h2>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchSupplierDashboard} className="btn btn-primary">
            <MdRefresh /> Retry
          </button>
        </div>
      </div>
    );
  }
  
  // Chart data
  const orderStatusData = {
    labels: ['Pending Approval', 'In Progress', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [
          dashboardData.summary.pendingApproval,
          dashboardData.summary.inProgress,
          dashboardData.summary.completed,
          dashboardData.summary.rejected
        ],
        backgroundColor: [
          'rgba(255, 193, 7, 0.8)',  // amber for pending
          'rgba(33, 150, 243, 0.8)',  // blue for in progress
          'rgba(76, 175, 80, 0.8)',   // green for completed
          'rgba(244, 67, 54, 0.8)'    // red for cancelled
        ],
        borderColor: [
          'rgb(255, 193, 7)',
          'rgb(33, 150, 243)',
          'rgb(76, 175, 80)',
          'rgb(244, 67, 54)'
        ],
        borderWidth: 2
      }
    ]
  };
  
  // Monthly order data
  const lineChartData = {
    labels: dashboardData.monthlyOrderData?.map(data => data.month) || [],
    datasets: [
      {
        label: 'Order Count',
        data: dashboardData.monthlyOrderData?.map(data => data.count) || [],
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Order Value ($)',
        data: dashboardData.monthlyOrderData?.map(data => data.value) || [],
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };
  
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Order Count'
        }
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        title: {
          display: true,
          text: 'Order Value ($)'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };
  
  const filteredOrders = getFilteredOrders();
  
  return (
    <Layout>
      <div className="supplier-dashboard supplier-portal">
        <div className="dashboard-header">
          <div className="supplier-info">
            <h2>Welcome, {dashboardData.supplier.name}</h2>
            <div className="supplier-details">
              <span className={`status-badge ${dashboardData.supplier.status}`}>
                {dashboardData.supplier.status}
              </span>
              <span className="supplier-since">Member since: {new Date(dashboardData.supplier.registeredSince).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="dashboard-actions">
            <button className="btn btn-primary" onClick={fetchSupplierDashboard}>
              <MdRefresh /> Refresh Dashboard
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card">
            <div className="card-content">
              <h3>Total Orders</h3>
              <div className="card-value">{dashboardData.summary.totalOrders}</div>
            </div>
            <div className="card-icon">
              <MdShoppingCart />
            </div>
          </div>
          
          <div className="card card-warning">
            <div className="card-content">
              <h3>Pending Approval</h3>
              <div className="card-value">{dashboardData.summary.pendingApproval}</div>
            </div>
            <div className="card-icon">
              <MdPendingActions />
            </div>
          </div>
          
          <div className="card card-info">
            <div className="card-content">
              <h3>In Progress</h3>
              <div className="card-value">{dashboardData.summary.inProgress}</div>
            </div>
            <div className="card-icon">
              <MdLocalShipping />
            </div>
          </div>
          
          <div className="card card-success">
            <div className="card-content">
              <h3>Completed</h3>
              <div className="card-value">{dashboardData.summary.completed}</div>
            </div>
            <div className="card-icon">
              <MdDoneAll />
            </div>
          </div>
          
          <div className="card card-danger">
            <div className="card-content">
              <h3>Rejected</h3>
              <div className="card-value">{dashboardData.summary.rejected}</div>
            </div>
            <div className="card-icon">
              <MdCancel />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="charts-section">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Monthly Order Trends</h3>
            </div>
            <div className="chart-container">
              {dashboardData.monthlyOrderData?.length > 0 ? (
                <Line data={lineChartData} options={lineChartOptions} />
              ) : (
                <div className="no-data">No monthly data available</div>
              )}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Orders by Status</h3>
            </div>
            <div className="chart-container">
              <Doughnut data={orderStatusData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Performance Section */}
        <div className="performance-section">
          <h3>Your Performance Metrics</h3>
          <div className="performance-metrics">
            <div className="metric">
              <div className="metric-header">
                <div className="metric-icon on-time">
                  <MdAccessTime />
                </div>
                <div className="metric-title">On-Time Delivery</div>
              </div>
              <div className="metric-value">{dashboardData.performance.onTimeDelivery}%</div>
              <div className="metric-bar">
                <div 
                  className="metric-progress" 
                  style={{ 
                    width: `${dashboardData.performance.onTimeDelivery}%`,
                    backgroundColor: dashboardData.performance.onTimeDelivery > 90 ? '#4caf50' : 
                                    dashboardData.performance.onTimeDelivery > 70 ? '#ff9800' : 
                                    '#f44336'
                  }}
                ></div>
              </div>
            </div>
            
            <div className="metric">
              <div className="metric-header">
                <div className="metric-icon lead-time">
                  <MdInventory />
                </div>
                <div className="metric-title">Your Product Items</div>
              </div>
              <div className="metric-value">{dashboardData.summary.suppliedItems}</div>
              <div className="metric-bar">
                <div 
                  className="metric-progress" 
                  style={{ 
                    width: `${Math.min(dashboardData.summary.suppliedItems * 10, 100)}%`,
                    backgroundColor: '#2196f3'
                  }}
                ></div>
              </div>
            </div>
            
            <div className="metric">
              <div className="metric-header">
                <div className="metric-icon value">
                  <MdAttachMoney />
                </div>
                <div className="metric-title">Total Order Value</div>
              </div>
              <div className="metric-value">{formatCurrency(dashboardData.summary.totalOrderValue)}</div>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="recent-orders-section">
          <div className="section-header">
            <h3>Your Orders</h3>
            <div className="order-filters">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <MdFilterList />
              </div>
              <div className="tab-filters">
                <button 
                  className={`tab-btn ${activeOrderTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveOrderTab('all')}
                >
                  All
                </button>
                <button 
                  className={`tab-btn ${activeOrderTab === 'pending' ? 'active' : ''}`}
                  onClick={() => setActiveOrderTab('pending')}
                >
                  Pending
                </button>
                <button 
                  className={`tab-btn ${activeOrderTab === 'approved' ? 'active' : ''}`}
                  onClick={() => setActiveOrderTab('approved')}
                >
                  In Progress
                </button>
                <button 
                  className={`tab-btn ${activeOrderTab === 'delivered' ? 'active' : ''}`}
                  onClick={() => setActiveOrderTab('delivered')}
                >
                  Completed
                </button>
                <button 
                  className={`tab-btn ${activeOrderTab === 'rejected' ? 'active' : ''}`}
                  onClick={() => setActiveOrderTab('rejected')}
                >
                  Rejected
                </button>
              </div>
            </div>
          </div>
          
          <div className="orders-table-container">
            {filteredOrders.length > 0 ? (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>Items</th>
                    <th>Total Value</th>
                    <th>Status</th>
                    <th>Expected Delivery</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order._id}>
                      <td className="po-number">{order.poNumber}</td>
                      <td>{order.items?.length || 0} items</td>
                      <td className="amount">{formatCurrency(order.totalAmount || 0)}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td>{order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <div className="action-buttons">
                          <Link 
                            to={`/supplier-portal/orders/${order._id}`}
                            className="btn-small btn-info"
                            title="View Details"
                          >
                            <MdVisibility />
                          </Link>
                          
                          {order.status === 'approved' && (
                            <button 
                              className="btn-small btn-success"
                              title="Mark as Delivered"
                              onClick={() => {
                                alert('This would mark the order as delivered (not implemented)');
                              }}
                            >
                              <MdCheck />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">
                <p>No orders found matching your criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="section-header supplied-items-header">
          <h3>Your Products</h3>
          <Link to="/supplier-portal/products" className="btn btn-outline">
            View All Products
          </Link>
        </div>
        
        <div className="supplied-items-section">
          {dashboardData.suppliedItems?.length > 0 ? (
            <div className="items-grid">
              {dashboardData.suppliedItems.map(item => (
                <div className="item-card" key={item._id}>
                  <div className="item-header">
                    <h4>{item.itemName}</h4>
                    <span className="item-id">{item.itemId}</span>
                  </div>
                  <div className="item-details">
                    <div className="stock-info">
                      <div className={`current-stock ${item.currentStock < item.minimumStock ? 'low-stock' : ''}`}>
                        {item.currentStock} {item.unit}
                        {item.currentStock < item.minimumStock && <MdWarning className="warning-icon" />}
                      </div>
                      <div className="min-stock">
                        Min: {item.minimumStock} | Max: {item.maximumStock}
                      </div>
                    </div>
                    <div className="warehouse-info">
                      <strong>Location:</strong> {item.location?.warehouse?.name || 'N/A'}
                    </div>
                    <div className="price-info">
                      <div>Cost: {formatCurrency(item.unitCost)}</div>
                      <div>Selling: {formatCurrency(item.sellingPrice)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No products found for your supplier account</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SupplierPortalDashboard;