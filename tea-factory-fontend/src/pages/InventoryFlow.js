import React, { useState, useEffect, useCallback } from 'react';
import { 
  MdTrendingUp, 
  MdTrendingDown,
  MdRefresh,
  MdFilterList,
  MdDateRange,
  MdInventory,
  MdSwapHoriz,
  MdDownload,
  MdVisibility
} from 'react-icons/md';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';
import './InventoryFlow.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InventoryFlow = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [dateRange, setDateRange] = useState('7'); // days
  const [transactionType, setTransactionType] = useState('all');
  const [itemFilter, setItemFilter] = useState('all');
  const [showChart, setShowChart] = useState('flow'); // 'flow' or 'volume'

  useEffect(() => {
    fetchData();
  }, []); // Remove applyFilters dependency

  // Move applyFilters into useCallback to prevent unnecessary re-renders
  const applyFilters = useCallback(() => {
    let filtered = [...transactions];

    // Date range filter
    if (dateRange !== 'all') {
      const days = parseInt(dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter(transaction => 
        new Date(transaction.createdAt) >= cutoffDate
      );
    }

    // Transaction type filter
    if (transactionType !== 'all') {
      filtered = filtered.filter(transaction => 
        transaction.transactionType === transactionType
      );
    }

    // Item filter
    if (itemFilter !== 'all') {
      filtered = filtered.filter(transaction => 
        transaction.itemId === itemFilter
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, dateRange, transactionType, itemFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]); // Now we can safely include applyFilters

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Starting to fetch inventory flow data...');
      
      // Test API connection first
      try {
        const testRes = await api.get('/inventory/test');
        console.log('✅ API connection test:', testRes.data);
      } catch (testError) {
        console.error('❌ API connection test failed:', testError);
      }
      
      // Try to fetch transactions
      let transactionsData = [];
      let inventoryData = [];
      
      try {
        console.log('📡 Fetching transactions from /inventory/transactions...');
        const transactionsRes = await api.get('/inventory/transactions');
        transactionsData = transactionsRes.data;
        console.log('✅ Transactions fetched:', transactionsData.length, 'items');
        console.log('📊 First transaction:', transactionsData[0]);
      } catch (transError) {
        console.error('❌ Failed to fetch transactions:', transError);
        console.error('Error details:', transError.response?.data);
        transactionsData = [];
      }
      
      try {
        console.log('📡 Fetching inventory from /inventory...');
        const inventoryRes = await api.get('/inventory');
        inventoryData = inventoryRes.data;
        console.log('✅ Inventory fetched:', inventoryData.length, 'items');
      } catch (invError) {
        console.error('❌ Failed to fetch inventory:', invError);
        console.error('Error details:', invError.response?.data);
        inventoryData = [];
      }
      
      setTransactions(transactionsData);
      setInventoryItems(inventoryData);
      
      if (transactionsData.length === 0) {
        setError('No transaction data available. Please add some inventory transactions first.');
      }
      
    } catch (error) {
      console.error('❌ Error in fetchData:', error);
      setError('Failed to load inventory flow data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFlowChartData = () => {
    const inboundData = {};
    const outboundData = {};
    const dates = [];

    // Group transactions by date
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    last7Days.forEach(date => {
      dates.push(new Date(date).toLocaleDateString());
      inboundData[date] = 0;
      outboundData[date] = 0;
    });

    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.createdAt).toISOString().split('T')[0];
      if (inboundData.hasOwnProperty(date)) {
        if (['inbound', 'receive', 'adjustment_in', 'initial_stock'].includes(transaction.transactionType)) {
          inboundData[date] += transaction.quantity;
        } else if (['outbound', 'issue', 'adjustment_out'].includes(transaction.transactionType)) {
          outboundData[date] += transaction.quantity;
        }
      }
    });

    return {
      labels: dates,
      datasets: [
        {
          label: 'Inbound',
          data: Object.values(inboundData),
          borderColor: 'rgba(76, 175, 80, 1)',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Outbound',
          data: Object.values(outboundData).map(val => -val),
          borderColor: 'rgba(244, 67, 54, 1)',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  const getVolumeChartData = () => {
    const itemVolumes = {};
    
    filteredTransactions.forEach(transaction => {
      if (!itemVolumes[transaction.itemId]) {
        itemVolumes[transaction.itemId] = 0;
      }
      itemVolumes[transaction.itemId] += Math.abs(transaction.quantity);
    });

    const sortedItems = Object.entries(itemVolumes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    return {
      labels: sortedItems.map(([itemId]) => {
        const item = inventoryItems.find(i => i.itemId === itemId);
        return item ? item.itemName : itemId;
      }),
      datasets: [{
        label: 'Transaction Volume',
        data: sortedItems.map(([,volume]) => volume),
        backgroundColor: [
          'rgba(76, 175, 80, 0.8)',
          'rgba(33, 150, 243, 0.8)',
          'rgba(255, 152, 0, 0.8)',
          'rgba(156, 39, 176, 0.8)',
          'rgba(244, 67, 54, 0.8)',
          'rgba(0, 150, 136, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(121, 85, 72, 0.8)',
          'rgba(158, 158, 158, 0.8)',
          'rgba(255, 87, 34, 0.8)'
        ]
      }]
    };
  };

  const getTransactionTypeStats = () => {
    const stats = {
      inbound: 0,
      outbound: 0,
      adjustments: 0,
      total: filteredTransactions.length
    };

    filteredTransactions.forEach(t => {
      if (['inbound', 'receive', 'initial_stock'].includes(t.transactionType)) {
        stats.inbound++;
      } else if (['outbound', 'issue'].includes(t.transactionType)) {
        stats.outbound++;
      } else {
        stats.adjustments++;
      }
    });

    return stats;
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Transaction ID', 'Item ID', 'Item Name', 'Type', 'Quantity', 'Previous Stock', 'New Stock', 'Performed By', 'Notes'].join(','),
      ...filteredTransactions.map(t => {
        const item = inventoryItems.find(i => i.itemId === t.itemId);
        return [
          new Date(t.createdAt).toLocaleString(),
          t.transactionId || t._id,
          t.itemId,
          item?.itemName || 'Unknown',
          t.transactionType,
          t.quantity,
          t.previousStock || 0,
          t.newStock || t.balanceAfter || 0,
          t.performedBy,
          t.notes || ''
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-flow-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTransactionIcon = (type) => {
    if (['inbound', 'receive', 'initial_stock', 'adjustment_in'].includes(type)) {
      return <MdTrendingUp className="transaction-icon inbound" />;
    } else if (['outbound', 'issue', 'adjustment_out'].includes(type)) {
      return <MdTrendingDown className="transaction-icon outbound" />;
    } else {
      return <MdSwapHoriz className="transaction-icon adjustment" />;
    }
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
      y: {
        beginAtZero: true,
      },
    },
  };

  const stats = getTransactionTypeStats();

  if (loading) {
    return (
      <div className="inventory-flow">
        <div className="page-header">
          <h2>Inventory Flow</h2>
        </div>
        <div className="loading">Loading inventory flow data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inventory-flow">
        <div className="page-header">
          <h2>Inventory Flow</h2>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchData} className="btn btn-primary">
            <MdRefresh /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-flow">
      <div className="page-header">
        <h2>Inventory Flow</h2>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchData}>
            <MdRefresh /> Refresh
          </button>
          <button className="btn btn-secondary" onClick={exportTransactions}>
            <MdDownload /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card card-success">
          <div className="card-content">
            <h3>Inbound Transactions</h3>
            <div className="card-value">{stats.inbound}</div>
          </div>
          <div className="card-icon">
            <MdTrendingUp />
          </div>
        </div>
        
        <div className="card card-danger">
          <div className="card-content">
            <h3>Outbound Transactions</h3>
            <div className="card-value">{stats.outbound}</div>
          </div>
          <div className="card-icon">
            <MdTrendingDown />
          </div>
        </div>
        
        <div className="card card-warning">
          <div className="card-content">
            <h3>Adjustments</h3>
            <div className="card-value">{stats.adjustments}</div>
          </div>
          <div className="card-icon">
            <MdSwapHoriz />
          </div>
        </div>
        
        <div className="card card-info">
          <div className="card-content">
            <h3>Total Transactions</h3>
            <div className="card-value">{stats.total}</div>
          </div>
          <div className="card-icon">
            <MdInventory />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-header">
          <h3><MdFilterList /> Filters</h3>
          <div className="chart-toggle">
            <button 
              className={`btn btn-small ${showChart === 'flow' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setShowChart('flow')}
            >
              Flow Chart
            </button>
            <button 
              className={`btn btn-small ${showChart === 'volume' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setShowChart('volume')}
            >
              Volume Chart
            </button>
          </div>
        </div>
        
        <div 
          className="filter-controls"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: '20px',
            flexWrap: 'wrap'
          }}
        >
          <div 
            className="filter-group"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              minWidth: '180px'
            }}
          >
            <label><MdDateRange /> Date Range</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="1">Last 24 Hours</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 3 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div 
            className="filter-group"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              minWidth: '180px'
            }}
          >
            <label>Transaction Type</label>
            <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
              <option value="receive">Receive</option>
              <option value="issue">Issue</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>

          <div 
            className="filter-group"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              minWidth: '180px'
            }}
          >
            <label>Item</label>
            <select value={itemFilter} onChange={(e) => setItemFilter(e.target.value)}>
              <option value="all">All Items</option>
              {inventoryItems.map(item => (
                <option key={item.itemId} value={item.itemId}>
                  {item.itemName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-section" style={{backgroundColor: 'transparent'}}>
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              {showChart === 'flow' ? 'Inventory Flow (Last 7 Days)' : 'Top Items by Transaction Volume'}
            </h3>
          </div>
          <div className="chart-container">
            {showChart === 'flow' ? (
              <Line data={getFlowChartData()} options={chartOptions} />
            ) : (
              <Bar data={getVolumeChartData()} options={chartOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transactions-section">
        <div className="section-header">
          <h3>Recent Transactions</h3>
          <span className="transaction-count">
            Showing {filteredTransactions.length} transactions
          </span>
        </div>
        
        <div className="transactions-table-container">
          {filteredTransactions.length > 0 ? (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Stock Change</th>
                  <th>Performed By</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.slice(0, 100).map(transaction => {
                  const item = inventoryItems.find(i => i.itemId === transaction.itemId);
                  return (
                    <tr key={transaction._id}>
                      <td className="transaction-date">
                        <div className="datetime">
                          <div className="date">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </div>
                          <div className="time">
                            {new Date(transaction.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="item-info">
                        <div className="item-details">
                          <div className="item-name">{item?.itemName || 'Unknown Item'}</div>
                          <div className="item-id">{transaction.itemId}</div>
                        </div>
                      </td>
                      <td className="transaction-type">
                        <div className="type-indicator">
                          {getTransactionIcon(transaction.transactionType)}
                          <span className={`type-text ${transaction.transactionType}`}>
                            {transaction.transactionType.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="quantity">
                        <span className="quantity-value">
                          {transaction.quantity} {item?.unit || 'units'}
                        </span>
                      </td>
                      <td className="stock-change">
                        <div className="stock-info">
                          <span className="previous">{transaction.previousStock || 0}</span>
                          <span className="arrow">→</span>
                          <span className="new">{transaction.newStock || transaction.balanceAfter || 0}</span>
                        </div>
                      </td>
                      <td className="performed-by">{transaction.performedBy}</td>
                      <td className="notes">
                        {transaction.notes && (
                          <div className="notes-cell" title={transaction.notes}>
                            {transaction.notes.length > 30 
                              ? `${transaction.notes.substring(0, 30)}...`
                              : transaction.notes
                            }
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="no-transactions">
              <MdVisibility size={64} color="#ccc" />
              <h3>No Transactions Found</h3>
              <p>No transactions match your current filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryFlow;