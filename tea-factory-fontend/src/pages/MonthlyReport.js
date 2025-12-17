import React, { useState, useEffect, useCallback } from 'react';
import { formatCurrency, formatCurrencyForExport } from '../utils/formatters';
import {
  MdCalendarToday,
  MdRefresh,
  MdDownload,
  MdBusiness,
  MdAssessment,
  MdWarning,
  MdCheckCircle,
  MdShowChart,
  MdBarChart,
  MdError
} from 'react-icons/md';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';
import './MonthlyReport.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyReport = () => {
  const [reportData, setReportData] = useState(null);
  const [yearlyComparison, setYearlyComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching monthly report data...'); // Debug log
      
      const response = await api.get('/reports/monthly', {
        params: {
          month: selectedMonth,
          year: selectedYear
        }
      });
      
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching monthly report:', error);
      setError('Failed to load monthly report data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  const fetchYearlyComparison = useCallback(async () => {
    try {
      const response = await api.get('/reports/yearly-comparison');
      setYearlyComparison(response.data);
    } catch (error) {
      console.error('Error fetching yearly comparison:', error);
    }
  }, []);

  useEffect(() => {
    fetchReportData();
    fetchYearlyComparison();
  }, [fetchReportData, fetchYearlyComparison]);

  const exportReport = () => {
    if (!reportData) return;

    const reportContent = generateReportContent();
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly-report-${selectedYear}-${selectedMonth.toString().padStart(2, '0')}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateReportContent = () => {
    const monthName = new Date(selectedYear, selectedMonth - 1, 1).toLocaleDateString('default', { month: 'long', year: 'numeric' });
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Monthly Report - ${monthName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 40px; }
          .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
          .summary-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
          .summary-value { font-size: 24px; font-weight: bold; color: #2e7d32; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f5f5f5; }
          .recommendation { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 10px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Tea Factory Monthly Report</h1>
          <h2>${monthName}</h2>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="summary-grid">
          <div class="summary-card">
            <h3>Total Items</h3>
            <div class="summary-value">${reportData.summary.inventory.totalItems}</div>
          </div>
          <div class="summary-card">
            <h3>Inventory Value</h3>
            <div class="summary-value">${formatCurrencyForExport(reportData.summary.inventory.totalValue)}</div>
          </div>
          <div class="summary-card">
            <h3>Total Transactions</h3>
            <div class="summary-value">${reportData.summary.transactions.totalTransactions}</div>
          </div>
          <div class="summary-card">
            <h3>Purchase Orders</h3>
            <div class="summary-value">${reportData.summary.purchaseOrders.totalOrders}</div>
          </div>
        </div>
        
        <h3>Category Analysis</h3>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Items</th>
              <th>Stock Value</th>
              <th>Low Stock</th>
              <th>Out of Stock</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.analytics.categoryAnalysis.map(cat => `
              <tr>
                <td>${cat._id}</td>
                <td>${cat.totalItems}</td>
                <td>${formatCurrencyForExport(cat.totalValue)}</td>
                <td>${cat.lowStockCount}</td>
                <td>${cat.outOfStockCount}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <h3>Recommendations</h3>
        ${reportData.recommendations.map(rec => `
          <div class="recommendation">
            <h4>${rec.title}</h4>
            <p>${rec.message}</p>
            <strong>Action: ${rec.action}</strong>
          </div>
        `).join('')}
        
        <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
          © ${new Date().getFullYear()} Tea Factory Ltd. All rights reserved.
        </div>
      </body>
      </html>
    `;
  };

  const getDailyTransactionChartData = () => {
    if (!reportData?.analytics.dailyTransactionTrend) return { labels: [], datasets: [] };
    
    const data = reportData.analytics.dailyTransactionTrend;
    const labels = Object.keys(data).sort();
    const inboundData = labels.map(date => data[date].inbound);
    const outboundData = labels.map(date => data[date].outbound);
    
    return {
      labels: labels.map(date => new Date(date).getDate()),
      datasets: [
        {
          label: 'Inbound',
          data: inboundData,
          borderColor: 'rgba(76, 175, 80, 1)',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Outbound',
          data: outboundData.map(val => -val),
          borderColor: 'rgba(244, 67, 54, 1)',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  const getCategoryChartData = () => {
    if (!reportData?.analytics.categoryAnalysis) return { labels: [], datasets: [] };
    
    const categories = reportData.analytics.categoryAnalysis.slice(0, 10);
    
    return {
      labels: categories.map(cat => cat._id),
      datasets: [{
        label: 'Inventory Value',
        data: categories.map(cat => cat.totalValue),
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
        ],
        borderWidth: 1
      }]
    };
  };

  const getPurchaseOrderStatusChartData = () => {
    if (!reportData?.summary.purchaseOrders) return { labels: [], datasets: [] };
    
    const po = reportData.summary.purchaseOrders;
    
    return {
      labels: ['Pending', 'Approved', 'Completed', 'Cancelled'],
      datasets: [{
        data: [po.pending, po.approved, po.completed, po.cancelled],
        backgroundColor: [
          'rgba(255, 193, 7, 0.8)',
          'rgba(33, 150, 243, 0.8)',
          'rgba(76, 175, 80, 0.8)',
          'rgba(244, 67, 54, 0.8)'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    }
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  if (loading) {
    return (
      <div className="monthly-report">
        <div className="page-header">
          <h2>Monthly Report</h2>
        </div>
        <div className="loading">Loading monthly report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="monthly-report">
        <div className="page-header">
          <h2>Monthly Report</h2>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchReportData} className="btn btn-primary">
            <MdRefresh /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="monthly-report">
      <div className="page-header">
        <h2>Monthly Report</h2>
        <div className="header-controls">
          <div className="date-selector">
            <MdCalendarToday />
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-outline" onClick={fetchReportData}>
            <MdRefresh /> Refresh
          </button>
          <button className="btn btn-secondary" onClick={exportReport}>
            <MdDownload /> Export Report
          </button>
        </div>
      </div>

      {reportData && (
        <>
          {/* Report Period */}
          <div className="report-period">
            <div className="period-card">
              <h3>Report Period</h3>
              <div className="period-details">
                <div className="period-month">{reportData.period.monthName} {reportData.period.year}</div>
                <div className="period-range">
                  {new Date(reportData.period.startDate).toLocaleDateString()} - {new Date(reportData.period.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          
          {/* Charts Section */}
          <div className="charts-section">
            <div className="chart-row">
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Daily Transaction Trend</h3>
                </div>
                <div className="chart-container">
                  <Line data={getDailyTransactionChartData()} options={chartOptions} />
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3>Purchase Order Status</h3>
                </div>
                <div className="chart-container">
                  <Doughnut data={getPurchaseOrderStatusChartData()} options={chartOptions} />
                </div>
              </div>
            </div>

            <div className="chart-row">
              <div className="chart-card full-width">
                <div className="chart-header">
                  <h3>Category-wise Inventory Value</h3>
                </div>
                <div className="chart-container">
                  <Bar data={getCategoryChartData()} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div className="tables-section">
            {/* Category Analysis */}
            <div className="table-card">
              <div className="table-header">
                <h3><MdBarChart /> Category Analysis</h3>
              </div>
              <div className="table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Total Items</th>
                      <th>Total Stock</th>
                      <th>Stock Value</th>
                      <th>Low Stock</th>
                      <th>Out of Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.analytics.categoryAnalysis.map(category => (
                      <tr key={category._id}>
                        <td className="category-name">{category._id}</td>
                        <td>{category.totalItems}</td>
                        <td>{category.totalStock.toLocaleString()}</td>
                        <td className="value">{formatCurrency(category.totalValue)}</td>
                        <td className={category.lowStockCount > 0 ? 'warning' : ''}>{category.lowStockCount}</td>
                        <td className={category.outOfStockCount > 0 ? 'danger' : ''}>{category.outOfStockCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Most Active Items */}
            <div className="table-card">
              <div className="table-header">
                <h3><MdShowChart /> Most Active Items</h3>
              </div>
              <div className="table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Item ID</th>
                      <th>Category</th>
                      <th>Total Transactions</th>
                      <th>Quantity Moved</th>
                      <th>Current Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.analytics.mostActiveItems.map(item => (
                      <tr key={item.itemId}>
                        <td className="item-name">{item.itemName}</td>
                        <td className="item-id">{item.itemId}</td>
                        <td>{item.category}</td>
                        <td>{item.totalTransactions}</td>
                        <td className="quantity">{item.totalQuantityMoved.toLocaleString()}</td>
                        <td>{item.currentStock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Supplier Performance */}
            {reportData.analytics.supplierPerformance.length > 0 && (
              <div className="table-card">
                <div className="table-header">
                  <h3><MdBusiness /> Supplier Performance</h3>
                </div>
                <div className="table-container">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Supplier</th>
                        <th>Total Orders</th>
                        <th>Total Value</th>
                        <th>Avg Order Value</th>
                        <th>On-Time Delivery</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.analytics.supplierPerformance.map(supplier => (
                        <tr key={supplier._id}>
                          <td className="supplier-name">{supplier.supplierName}</td>
                          <td>{supplier.totalOrders}</td>
                          <td className="value">{formatCurrency(supplier.totalValue)}</td>
                          <td className="value">{formatCurrency(supplier.averageOrderValue)}</td>
                          <td className={`percentage ${supplier.onTimePercentage >= 90 ? 'success' : supplier.onTimePercentage >= 80 ? 'warning' : 'danger'}`}>
                            {supplier.onTimePercentage.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {reportData.recommendations.length > 0 && (
            <div className="recommendations-section">
              <div className="section-header">
                <h3><MdAssessment /> Recommendations</h3>
              </div>
              <div className="recommendations-list">
                {reportData.recommendations.map((recommendation, index) => (
                  <div key={index} className={`recommendation-card ${recommendation.type}`}>
                    <div className="recommendation-header">
                      <div className="recommendation-icon">
                        {recommendation.type === 'critical' && <MdError />}
                        {recommendation.type === 'warning' && <MdWarning />}
                        {recommendation.type === 'info' && <MdCheckCircle />}
                      </div>
                      <h4>{recommendation.title}</h4>
                    </div>
                    <p className="recommendation-message">{recommendation.message}</p>
                    <div className="recommendation-action">
                      <strong>Recommended Action:</strong> {recommendation.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div className="page-footer">
        <p>Report generated on {new Date().toLocaleString()}</p>
        <p>© {new Date().getFullYear()} Tea Factory Ltd. All rights reserved.</p>
      </div>
    </div>
  );
};

export default MonthlyReport;