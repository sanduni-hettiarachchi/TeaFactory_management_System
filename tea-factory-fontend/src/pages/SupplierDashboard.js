import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { 
  MdBusiness, 
  MdCheckCircle, 
  MdAccessTime, 
  MdAttachMoney, 
  MdPeople, 
  MdShoppingCart,
  MdRefresh,
  MdDashboard,
  MdVisibility,
  MdCheck,
  MdClose
} from 'react-icons/md';
import api from '../services/api';
import './SupplierDashboard.css';
import { formatCurrency } from '../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SupplierDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalSuppliers: 0,
      activeSuppliers: 0,
      pendingOrders: 0,
      totalOrderValue: 0
    },
    recentOrders: [],
    supplierPerformance: [],
    ordersByStatus: {
      pending: 0,
      approved: 0,
      delivered: 0,
      rejected: 0
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/suppliers/dashboard');
      console.log('Dashboard data received:', response.data);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching supplier dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      await api.put(`/purchase-orders/${orderId}`, { 
        status: action === 'approve' ? 'approved' : 'rejected' 
      });
      fetchDashboardData();
      alert(`Order ${action}d successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      alert(`Failed to ${action} order`);
    }
  };

  // Chart configurations
  const supplierPerformanceData = {
    labels: dashboardData.supplierPerformance?.map(item => item.supplierName || 'Unknown') || [],
    datasets: [
      {
        label: 'Total Orders',
        data: dashboardData.supplierPerformance?.map(item => item.totalOrders || 0) || [],
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 2,
        borderRadius: 5,
      },
      {
        label: 'On-Time Delivery %',
        data: dashboardData.supplierPerformance?.map(item => Math.round(item.onTimePercentage || 0)) || [],
        backgroundColor: 'rgba(33, 150, 243, 0.8)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 2,
        borderRadius: 5,
      }
    ],
  };

  const orderStatusData = {
    labels: ['Pending', 'Approved', 'Delivered', 'Rejected'],
    datasets: [
      {
        data: [
          dashboardData.ordersByStatus?.pending || 0,
          dashboardData.ordersByStatus?.approved || 0,
          dashboardData.ordersByStatus?.delivered || 0,
          dashboardData.ordersByStatus?.rejected || 0
        ],
        backgroundColor: [
          'rgba(255, 193, 7, 0.8)',
          'rgba(76, 175, 80, 0.8)',
          'rgba(33, 150, 243, 0.8)',
          'rgba(244, 67, 54, 0.8)',
        ],
        borderColor: [
          'rgba(255, 193, 7, 1)',
          'rgba(76, 175, 80, 1)',
          'rgba(33, 150, 243, 1)',
          'rgba(244, 67, 54, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          color: '#666',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="supplier-dashboard">
        <div className="dashboard-header">
          <h2>Supplier Dashboard</h2>
        </div>
        <div className="loading">Loading supplier dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="supplier-dashboard">
        <div className="dashboard-header">
          <h2>Supplier Dashboard</h2>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="btn btn-primary">
            <MdRefresh /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="supplier-dashboard">
      <div className="dashboard-header">
        <h2>Supplier Dashboard</h2>
        <div className="dashboard-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.href = '/suppliers/manage'}
          >
            <MdPeople />
            Manage Suppliers
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => window.location.href = '/suppliers/orders'}
          >
            <MdShoppingCart />
            Purchase Orders
          </button>
          <button 
            className="btn btn-outline" 
            onClick={() => window.location.href = '/suppliers'}
          >
            <MdDashboard />
            Suppliers Hub
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <div className="card-content">
            <h3>Total Suppliers</h3>
            <div className="card-value">{dashboardData.summary.totalSuppliers}</div>
          </div>
          <div className="card-icon">
            <MdBusiness />
          </div>
        </div>
        
        <div className="card card-success">
          <div className="card-content">
            <h3>Active Suppliers</h3>
            <div className="card-value">{dashboardData.summary.activeSuppliers}</div>
          </div>
          <div className="card-icon">
            <MdCheckCircle />
          </div>
        </div>
        
        <div className="card card-warning">
          <div className="card-content">
            <h3>Pending Orders</h3>
            <div className="card-value">{dashboardData.summary.pendingOrders}</div>
          </div>
          <div className="card-icon">
            <MdAccessTime />
          </div>
        </div>
        
        <div className="card card-info">
          <div className="card-content">
            <h3>Total Order Value</h3>
            <div className="card-value">{formatCurrency(dashboardData.summary.totalOrderValue || 0)}</div>
          </div>
          <div className="card-icon">
            <MdAttachMoney />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Supplier Performance</h3>
          </div>
          <div className="chart-container">
            {dashboardData.supplierPerformance?.length > 0 ? (
              <Bar data={supplierPerformanceData} options={chartOptions} />
            ) : (
              <div className="no-chart-data">
                <p>No supplier performance data available</p>
              </div>
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

      {/* Recent Orders Table */}
      <div className="recent-orders-section">
        <div className="section-header">
          <h3>Recent Purchase Orders</h3>
          <button className="btn btn-outline" onClick={fetchDashboardData}>
            <MdRefresh />
            Refresh
          </button>
        </div>
        <div className="orders-table-container">
          {dashboardData.recentOrders?.length > 0 ? (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Supplier</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Expected Delivery</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentOrders.map(order => (
                  <tr key={order._id}>
                    <td className="po-number">{order.poNumber}</td>
                    <td>{order.supplier?.name || 'Unknown'}</td>
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
                        <button 
                          className="btn-small btn-info"
                          onClick={() => window.location.href = `/suppliers/orders/${order._id}`}
                          title="View Details"
                        >
                          <MdVisibility />
                        </button>
                        {order.status === 'pending' && (
                          <>
                            <button 
                              className="btn-small btn-success"
                              onClick={() => handleOrderAction(order._id, 'approve')}
                              title="Approve Order"
                            >
                              <MdCheck />
                            </button>
                            <button 
                              className="btn-small btn-danger"
                              onClick={() => handleOrderAction(order._id, 'reject')}
                              title="Reject Order"
                            >
                              <MdClose />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-orders">
              <p>No purchase orders found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;