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
  PointElement,
  LineElement,
} from 'chart.js';
import { 
  MdRefresh, 
  MdWarning, 
  MdError, 
  MdTrendingUp, 
  MdInventory,
  MdShoppingCart,
  MdAttachMoney,
  MdNotifications
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
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalItems: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      totalValue: 0,
      recentTransactions: 0,
      pendingPurchaseOrders: 0,
      monthlyPOValue: 0,
      criticalItemsCount: 0
    },
    stockByCategory: [],
    topItemsByValue: [],
    stockStatusDistribution: [],
    criticalItems: []
  });

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    fetchAlerts();

    const interval = setInterval(() => {
      fetchDashboardData();
      fetchAlerts();
    }, 300000); // refresh every 5 min

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/');
      const data = response.data || {};

      setDashboardData({
        summary: {
          totalItems: data.summary?.totalItems || 0,
          lowStockItems: data.summary?.lowStockItems || 0,
          outOfStockItems: data.summary?.outOfStockItems || 0,
          totalValue: data.summary?.totalValue || 0,
          recentTransactions: data.summary?.recentTransactions || 0,
          pendingPurchaseOrders: data.summary?.pendingPurchaseOrders || 0,
          monthlyPOValue: data.summary?.monthlyPOValue || 0,
          criticalItemsCount: data.summary?.criticalItemsCount || 0
        },
        stockByCategory: Array.isArray(data.stockByCategory) ? data.stockByCategory : [],
        topItemsByValue: Array.isArray(data.topItemsByValue) ? data.topItemsByValue : [],
        stockStatusDistribution: Array.isArray(data.stockStatusDistribution) ? data.stockStatusDistribution : [],
        criticalItems: Array.isArray(data.criticalItems) ? data.criticalItems : []
      });

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/dashboard/alerts');
      setAlerts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
    fetchAlerts();
  };

  // ================= Charts =================
  const stockLevelsData = {
    labels: dashboardData.stockByCategory?.map(item => item._id || 'Unknown') || [],
    datasets: [
      {
        label: 'Total Stock',
        data: dashboardData.stockByCategory?.map(item => item.totalStock || 0) || [],
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 2,
        borderRadius: 5,
      },
      {
        label: 'Low Stock Items',
        data: dashboardData.stockByCategory?.map(item => item.lowStockCount || 0) || [],
        backgroundColor: 'rgba(255, 152, 0, 0.8)',
        borderColor: 'rgba(255, 152, 0, 1)',
        borderWidth: 2,
        borderRadius: 5,
      }
    ],
  };

  const stockLevelsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: { color: '#2e7d32', font: { weight: 'bold' } }
      },
      title: { 
        display: true, 
        text: 'Stock Distribution by Category',
        color: '#2e7d32',
        font: { size: 18, weight: 'bold' }
      },
    },
    layout: { padding: 20 },
    backgroundColor: 'white',
    scales: {
      y: { 
        beginAtZero: true, 
        ticks: { color: '#666', font: { weight: 'bold' } },
        grid: { color: 'rgba(76,175,80,0.08)' }
      },
      x: { 
        ticks: { color: '#666', font: { weight: 'bold' } },
        grid: { color: 'rgba(76,175,80,0.08)' }
      },
    },
  };

  const statusDistributionData = {
    labels: dashboardData.stockStatusDistribution?.map(item => {
      switch (item._id) {
        case 'in_stock': return 'In Stock';
        case 'low_stock': return 'Low Stock';
        case 'out_of_stock': return 'Out of Stock';
        default: return item._id || 'Unknown';
      }
    }) || [],
    datasets: [
      {
        data: dashboardData.stockStatusDistribution?.map(item => item.count || 0) || [],
        backgroundColor: [
          'rgba(76, 175, 80, 0.8)',
          'rgba(255, 152, 0, 0.8)',
          'rgba(244, 67, 54, 0.8)',
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(244, 67, 54, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const statusDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, usePointStyle: true, color: '#2e7d32', font: { weight: 'bold' } },
      },
      title: { 
        display: true, 
        text: 'Stock Status Distribution',
        color: '#2e7d32',
        font: { size: 18, weight: 'bold' }
      },
    },
    layout: { padding: 20 },
    backgroundColor: 'white',
  };

  // ================= Rendering =================
  if (loading) {
    return (
      <div className="supplier-dashboard">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={handleRefresh} disabled>
              <MdRefresh className={loading ? 'rotating' : ''} /> Loading...
            </button>
          </div>
        </div>
        <div className="loading">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="supplier-dashboard">
      <div className="dashboard-content-container">
        <div className="dashboard-header">
          <h2>Tea Factory Dashboard</h2>
          <div className="header-actions">
            <div className="last-refresh">
              <small>Last updated: {lastRefresh.toLocaleTimeString()}</small>
            </div>
            <button className="btn btn-primary" onClick={handleRefresh}>
              <MdRefresh /> Refresh
            </button>
          </div>
        </div>

        {alerts.length > 0 && (
          <div className="alerts-section mb-8">
            <h3 className="section-title">
              <MdNotifications /> Active Alerts <span className="count-badge">{alerts.length}</span>
            </h3>
            <div className="alerts-list">
              {alerts.slice(0, 3).map(alert => (
                <div key={alert.id || Math.random()} className={`alert-card alert-${alert.type}`}>
                  <div className="alert-icon">
                    {alert.type === 'critical' ? <MdError /> : <MdWarning />}
                  </div>
                  <div className="alert-content">
                    <strong>{alert.title}</strong>
                    <p>{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card">
            <div className="card-content">
              <h3>Total Inventory Items</h3>
              <div className="card-value">{dashboardData.summary.totalItems.toLocaleString()}</div>
              <div className="card-subtext">Active inventory items</div>
            </div>
            <div className="card-icon"><MdInventory /></div>
          </div>
          <div className="card card-warning">
            <div className="card-content">
              <h3>Low Stock Items</h3>
              <div className="card-value">{dashboardData.summary.lowStockItems}</div>
              <div className="card-subtext">{dashboardData.summary.criticalItemsCount} critical</div>
            </div>
            <div className="card-icon"><MdWarning /></div>
          </div>
          <div className="card card-danger">
            <div className="card-content">
              <h3>Out of Stock</h3>
              <div className="card-value">{dashboardData.summary.outOfStockItems}</div>
              <div className="card-subtext">Require immediate attention</div>
            </div>
            <div className="card-icon"><MdError /></div>
          </div>
          <div className="card card-success">
            <div className="card-content">
              <h3>Total Inventory Value</h3>
              <div className="card-value">{formatCurrency(dashboardData.summary.totalValue || 0)}</div>
              <div className="card-subtext">Current market value</div>
            </div>
            <div className="card-icon"><MdAttachMoney /></div>
          </div>
          <div className="card">
            <div className="card-content">
              <h3>Pending Orders</h3>
              <div className="card-value">{dashboardData.summary.pendingPurchaseOrders}</div>
              <div className="card-subtext">{formatCurrency(dashboardData.summary.monthlyPOValue || 0)} this month</div>
            </div>
            <div className="card-icon"><MdShoppingCart /></div>
          </div>
          <div className="card">
            <div className="card-content">
              <h3>Recent Transactions</h3>
              <div className="card-value">{dashboardData.summary.recentTransactions}</div>
              <div className="card-subtext">Last 7 days</div>
            </div>
            <div className="card-icon"><MdTrendingUp /></div>
          </div>
        </div>

        {/* Critical Items */}
        {dashboardData.criticalItems.length > 0 && (
          <div className="critical-items-section mb-8">
            <h3 className="section-title">
              <MdError /> Critical Stock Items
            </h3>
            <div className="critical-items-grid">
              {dashboardData.criticalItems.map(item => (
                <div key={item.itemId || Math.random()} className="critical-item-card">
                  <div className="item-icon"><MdInventory /></div>
                  <div className="item-info">
                    <strong>{item.itemName}</strong>
                    <span className="item-id">{item.itemId}</span>
                  </div>
                  <div className="stock-info">
                    <span className="current-stock">{item.currentStock}</span>
                    <span className="min-stock">Min: {item.minimumStock}</span>
                  </div>
                  <span className="critical-badge">Critical</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="charts-section">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Stock Levels by Category</h3>
            </div>
            <div className="chart-container">
              <Bar data={stockLevelsData} options={stockLevelsOptions} />
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-header">
              <h3>Stock Status Overview</h3>
            </div>
            <div className="chart-container">
              <Doughnut data={statusDistributionData} options={statusDistributionOptions} />
            </div>
          </div>
        </div>

        {/* Top Items */}
        {dashboardData.topItemsByValue.length > 0 && (
          <div className="top-items-section mb-8">
            <h3 className="section-title">Top Items by Value</h3>
            <div className="top-items-grid">
              {dashboardData.topItemsByValue.slice(0, 6).map(item => (
                <div key={item.itemId || Math.random()} className="top-item-card">
                  <div className="top-item-icon"><MdAttachMoney /></div>
                  <div className="item-name">{item.itemName}</div>
                  <div className="item-stock">{item.currentStock} {item.unit}</div>
                  <div className="item-value-badge">
                    {formatCurrency(((item.unitCost || item.costPerUnit || 0) * item.currentStock) || 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
