import React, { useState, useEffect, useCallback } from 'react';
import {
  MdNotifications,
  MdNotificationsActive,
  MdWarning,
  MdError,
  MdInfo,
  MdCheckCircle,
  MdRefresh,
  MdMarkEmailRead,
  MdDelete,
  MdFilterList,
  MdSend,
  MdInventory,
  MdBusiness,
  MdReorder,
  MdSettings
} from 'react-icons/md';
import api from '../services/api';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalCount: 0
  });

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: statusFilter,
        type: typeFilter,
        priority: priorityFilter,
        page: currentPage,
        limit: 20
      });
      
      const response = await api.get(`/notifications?${params}`);
      setNotifications(response.data.notifications);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, priorityFilter, currentPage]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/notifications/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching notification stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, [fetchNotifications, fetchStats]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`, { userId: 'admin' });
      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      alert('Failed to mark notification as read');
    }
  };

  const handleResolve = async (notificationId, notes = '') => {
    try {
      await api.patch(`/notifications/${notificationId}/resolve`, { 
        userId: 'admin', 
        notes 
      });
      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Error resolving notification:', error);
      alert('Failed to resolve notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read', { userId: 'admin' });
      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Error marking all as read:', error);
      alert('Failed to mark all notifications as read');
    }
  };

  const handleSendLowStockAlerts = async () => {
    try {
      setLoading(true);
      const response = await api.post('/notifications/send-low-stock-alerts');
      alert(response.data.message);
      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Error sending low stock alerts:', error);
      alert('Failed to send low stock alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await api.delete(`/notifications/${notificationId}`);
        fetchNotifications();
        fetchStats();
      } catch (error) {
        console.error('Error deleting notification:', error);
        alert('Failed to delete notification');
      }
    }
  };

  // Add the missing handlePageChange function
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return <MdError className="priority-icon critical" />;
      case 'high':
        return <MdWarning className="priority-icon high" />;
      case 'medium':
        return <MdInfo className="priority-icon medium" />;
      case 'low':
        return <MdInfo className="priority-icon low" />;
      default:
        return <MdInfo className="priority-icon" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'low_stock':
      case 'out_of_stock':
        return <MdInventory />;
      case 'reorder_request':
        return <MdReorder />;
      case 'supplier_alert':
        return <MdBusiness />;
      case 'system_alert':
        return <MdSettings />;
      default:
        return <MdNotifications />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="notifications">
        <div className="page-header">
          <h2>Notifications</h2>
        </div>
        <div className="loading">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="notifications">
      <div className="page-header">
        <h2>Notifications</h2>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchNotifications}>
            <MdRefresh /> Refresh
          </button>
          <button className="btn btn-secondary" onClick={handleMarkAllAsRead}>
            <MdMarkEmailRead /> Mark All Read
          </button>
          <button className="btn btn-warning" onClick={handleSendLowStockAlerts}>
            <MdSend /> Send Stock Alerts
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card unread">
          <div className="stat-content">
            <h3>Unread</h3>
            <div className="stat-value">{stats.unread || 0}</div>
          </div>
          <div className="stat-icon">
            <MdNotificationsActive />
          </div>
        </div>
        
        <div className="stat-card critical">
          <div className="stat-content">
            <h3>Critical</h3>
            <div className="stat-value">{stats.critical || 0}</div>
          </div>
          <div className="stat-icon">
            <MdError />
          </div>
        </div>
        
        <div className="stat-card action-required">
          <div className="stat-content">
            <h3>Action Required</h3>
            <div className="stat-value">{stats.actionRequired || 0}</div>
          </div>
          <div className="stat-icon">
            <MdWarning />
          </div>
        </div>
        
        <div className="stat-card low-stock">
          <div className="stat-content">
            <h3>Low Stock Alerts</h3>
            <div className="stat-value">{stats.lowStock || 0}</div>
          </div>
          <div className="stat-icon">
            <MdInventory />
          </div>
        </div>
      </div>

      {/* Filters */}
      {/* <div className="filters-section">
        <div className="filters-header">
          <h3><MdFilterList /> Filters</h3>
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <label>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Type</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="reorder_request">Reorder Request</option>
              <option value="supplier_alert">Supplier Alert</option>
              <option value="system_alert">System Alert</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Priority</label>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div> */}

      {/* Filters */}
<div className="filters-section">
  <div className="filters-header">
    <h3><MdFilterList /> Filters</h3>
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
        minWidth: '150px'
      }}
    >
      <label>Status</label>
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="all">All Status</option>
        <option value="unread">Unread</option>
        <option value="read">Read</option>
        <option value="resolved">Resolved</option>
      </select>
    </div>

    <div 
      className="filter-group"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        minWidth: '150px'
      }}
    >
      <label>Type</label>
      <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
        <option value="all">All Types</option>
        <option value="low_stock">Low Stock</option>
        <option value="out_of_stock">Out of Stock</option>
        <option value="reorder_request">Reorder Request</option>
        <option value="supplier_alert">Supplier Alert</option>
        <option value="system_alert">System Alert</option>
      </select>
    </div>

    <div 
      className="filter-group"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        minWidth: '150px'
      }}
    >
      <label>Priority</label>
      <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
        <option value="all">All Priorities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
  </div>
</div>

      {/* Notifications List */}
      <div className="notifications-list">
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchNotifications} className="btn btn-primary">
              <MdRefresh /> Retry
            </button>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="no-notifications">
            <MdCheckCircle size={64} color="#4caf50" />
            <h3>No Notifications</h3>
            <p>You're all caught up! No notifications match your current filters.</p>
          </div>
        ) : (
          <div className="notification-items">
            {notifications.map(notification => (
              <div 
                key={notification._id} 
                className={`notification-item ${notification.status} ${notification.priority}`}
              >
                <div className="notification-header">
                  <div className="notification-meta">
                    <div className="type-icon">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="priority-badge">
                      {getPriorityIcon(notification.priority)}
                      <span className="priority-text">{notification.priority.toUpperCase()}</span>
                    </div>
                    <div className="timestamp">{formatDate(notification.createdAt)}</div>
                  </div>
                  
                  <div className="notification-actions">
                    {notification.status === 'unread' && (
                      <button 
                        className="btn-small btn-outline"
                        onClick={() => handleMarkAsRead(notification._id)}
                        title="Mark as Read"
                      >
                        <MdMarkEmailRead />
                      </button>
                    )}
                    
                    {notification.actionRequired && notification.status !== 'resolved' && (
                      <button 
                        className="btn-small btn-success"
                        onClick={() => handleResolve(notification._id)}
                        title="Mark as Resolved"
                      >
                        <MdCheckCircle />
                      </button>
                    )}
                    
                    <button 
                      className="btn-small btn-danger"
                      onClick={() => handleDelete(notification._id)}
                      title="Delete"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>

                <div className="notification-content">
                  <h4 className="notification-title">{notification.title}</h4>
                  <p className="notification-message">{notification.message}</p>
                  
                  {notification.relatedEntity && (
                    <div className="related-entity">
                      <strong>Related:</strong> {notification.relatedEntity.entityName} 
                      ({notification.relatedEntity.entityId})
                    </div>
                  )}
                  
                  {notification.actionUrl && (
                    <div className="action-link">
                      <a 
                        href={notification.actionUrl} 
                        className="btn btn-small btn-primary"
                      >
                        Take Action
                      </a>
                    </div>
                  )}
                </div>

                {notification.status === 'resolved' && (
                  <div className="resolution-info">
                    <MdCheckCircle className="resolved-icon" />
                    Resolved by {notification.resolvedBy} on {new Date(notification.resolvedAt).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.total > 1 && (
          <div className="pagination">
            <button 
              className="btn btn-outline"
              disabled={pagination.current === 1}
              onClick={() => handlePageChange(pagination.current - 1)}
            >
              Previous
            </button>
            
            <span className="pagination-info">
              Page {pagination.current} of {pagination.total} 
              ({pagination.totalCount} total notifications)
            </span>
            
            <button 
              className="btn btn-outline"
              disabled={pagination.current === pagination.total}
              onClick={() => handlePageChange(pagination.current + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;