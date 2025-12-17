import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MdDashboard, 
  MdInventory, 
  MdSwapHoriz, 
  MdRefresh, 
  MdAssessment, 
  MdNotifications, 
  MdBusiness, 
  MdWarehouse, 
  MdPeople,
  MdShoppingCart,
  MdKeyboardArrowDown
} from 'react-icons/md';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
    { path: '/inventory-list', label: 'Inventory List', icon: <MdInventory /> },
    { path: '/inventory-flow', label: 'Inventory Flow', icon: <MdSwapHoriz /> },
    { path: '/reorders', label: 'Reorders', icon: <MdRefresh /> },
    { path: '/monthly-report', label: 'Monthly Report', icon: <MdAssessment /> },
    { path: '/notifications', label: 'Notifications', icon: <MdNotifications /> },
    {
      key: 'suppliers',
      label: 'Suppliers',
      icon: <MdBusiness />,
      hasSubmenu: true,
      submenu: [
        { path: '/suppliers/dashboard', label: 'Supplier Dashboard', icon: <MdDashboard /> },
        { path: '/suppliers/manage', label: 'Manage Suppliers', icon: <MdPeople /> },
        { path: '/suppliers/orders', label: 'Purchase Orders', icon: <MdShoppingCart /> },
      ]
    },
    { path: '/warehouses', label: 'Warehouses', icon: <MdWarehouse /> },

  ];

  const isActiveSubmenu = (submenu) => {
    return submenu.some(item => location.pathname === item.path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Inventory & Stock Management System</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.key || item.path}>
            {item.hasSubmenu ? (
              <>
                <div 
                  className={`nav-item submenu-toggle ${isActiveSubmenu(item.submenu) ? 'active' : ''}`}
                  onClick={() => toggleSubmenu(item.key)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  <span className={`submenu-arrow ${expandedMenus[item.key] ? 'expanded' : ''}`}>
                    <MdKeyboardArrowDown />
                  </span>
                </div>
                <div className={`submenu ${expandedMenus[item.key] ? 'expanded' : ''}`}>
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={`nav-item sub-nav-item ${location.pathname === subItem.path ? 'active' : ''}`}
                    >
                      <span className="nav-icon">{subItem.icon}</span>
                      <span className="nav-label">{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <Link
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;