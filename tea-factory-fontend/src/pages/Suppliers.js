import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDashboard, MdPeople, MdShoppingCart, MdBusiness, MdAttachMoney, MdAccessTime } from 'react-icons/md';
import './Suppliers.css';

const Suppliers = () => {
  const navigate = useNavigate();

  const supplierModules = [
    {
      title: 'Supplier Dashboard',
      description: 'View supplier analytics, performance metrics, and recent activities',
      icon: <MdDashboard />,
      path: '/suppliers/dashboard',
      color: 'primary'
    },
    {
      title: 'Manage Suppliers',
      description: 'Add, edit, and manage supplier information and contacts',
      icon: <MdPeople />,
      path: '/suppliers/manage',
      color: 'success'
    },
    {
      title: 'Purchase Orders',
      description: 'Create, manage, and track purchase orders from suppliers',
      icon: <MdShoppingCart />,
      path: '/suppliers/orders',
      color: 'info'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="suppliers-hub">
      <div className="page-header">
        <h2>Supplier Management Hub</h2>
        <p className="page-description">
          Manage your suppliers, track orders, and monitor supplier performance
        </p>
      </div>

      <div className="modules-grid">
        {supplierModules.map((module) => (
          <div 
            key={module.path}
            className={`module-card module-${module.color}`}
            onClick={() => handleNavigation(module.path)}
          >
            <div className="module-icon">{module.icon}</div>
            <div className="module-content">
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <button className="module-button">
                Access Module →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-stats">
        <h3>Quick Overview</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon"><MdBusiness /></div>
            <div className="stat-content">
              <div className="stat-label">Total Suppliers</div>
              <div className="stat-value">--</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><MdShoppingCart /></div>
            <div className="stat-content">
              <div className="stat-label">Active Orders</div>
              <div className="stat-value">--</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><MdAccessTime /></div>
            <div className="stat-content">
              <div className="stat-label">Pending Approvals</div>
              <div className="stat-value">--</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><MdAttachMoney /></div>
            <div className="stat-content">
              <div className="stat-label">Monthly Spend</div>
              <div className="stat-value">--</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suppliers;