import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contex/AuthContext';
import { 
  MdDashboard,
  MdShoppingCart,
  MdHistory,
  MdInventory,
  MdInsertChart,
  MdAccountCircle,
  MdSettings,
  MdHelp,
  MdLogout,
  MdMessage,
  MdExpandMore,
  MdExpandLess,
  MdLocalShipping
} from 'react-icons/md';
import { FaLeaf } from 'react-icons/fa';
import './SupplierSidebar.css';
import MobileMenuToggle from './MobileMenuToggle';

const SupplierSidebar = () => {
  const { logout, currentUser } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({
    orders: true,
    products: false,
    account: false
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Move the useEffect hook before any conditional returns
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);
  
  // Only render for suppliers
  if (!currentUser || currentUser.role !== 'supplier') {
    return null;
  }

  const toggleMenu = (menu) => {
    setExpandedMenus({
      ...expandedMenus,
      [menu]: !expandedMenus[menu]
    });
  };
  
  const handleLogout = () => {
    logout();
    window.location.href = '/supplier-login';
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <>
      <MobileMenuToggle isOpen={mobileMenuOpen} toggleMenu={toggleMobileMenu} />
      {mobileMenuOpen && <div className="sidebar-overlay" onClick={toggleMobileMenu}></div>}
      <aside className={`supplier-sidebar ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <FaLeaf className="logo-icon" />
          </div>
          <h2>Tea Supplier Portal</h2>
        </div>
        
        <div className="supplier-profile">
          <div className="profile-avatar">
            {currentUser?.name?.charAt(0) || 'S'}
          </div>
          <div className="profile-info">
            <h3>{currentUser?.name || 'Supplier'}</h3>
            <span className="profile-email">{currentUser?.email || 'supplier@example.com'}</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/supplier-portal" end className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <div className="nav-icon">
                  <MdDashboard />
                </div>
                <span>Dashboard</span>
                <div className="indicator"></div>
              </NavLink>
            </li>
            
            <div className="sidebar-divider"></div>
            
            <li className="nav-section">
              <h3>Orders</h3>
              <div className="nav-item submenu-toggle" onClick={() => toggleMenu('orders')}>
                <div className="nav-icon">
                  <MdShoppingCart />
                </div>
                <span>Orders Management</span>
                {expandedMenus.orders ? <MdExpandLess /> : <MdExpandMore />}
              </div>
              <ul className={`submenu ${expandedMenus.orders ? 'expanded' : ''}`}>
                <li>
                  <NavLink to="/supplier-portal/orders" className={({isActive}) => isActive ? 'nav-item sub-nav-item active' : 'nav-item sub-nav-item'}>
                    <div className="nav-icon">
                      <MdShoppingCart />
                    </div>
                    <span>Current Orders</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/supplier-portal/order-history" className={({isActive}) => isActive ? 'nav-item sub-nav-item active' : 'nav-item sub-nav-item'}>
                    <div className="nav-icon">
                      <MdHistory />
                    </div>
                    <span>Order History</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/supplier-portal/deliveries" className={({isActive}) => isActive ? 'nav-item sub-nav-item active' : 'nav-item sub-nav-item'}>
                    <div className="nav-icon">
                      <MdLocalShipping />
                    </div>
                    <span>Deliveries</span>
                  </NavLink>
                </li>
              </ul>
            </li>
            
            <li className="nav-section">
              <h3>Products</h3>
              <div className="nav-item submenu-toggle" onClick={() => toggleMenu('products')}>
                <div className="nav-icon">
                  <MdInventory />
                </div>
                <span>Product Management</span>
                {expandedMenus.products ? <MdExpandLess /> : <MdExpandMore />}
              </div>
              <ul className={`submenu ${expandedMenus.products ? 'expanded' : ''}`}>
                <li>
                  <NavLink to="/supplier-portal/products" className={({isActive}) => isActive ? 'nav-item sub-nav-item active' : 'nav-item sub-nav-item'}>
                    <div className="nav-icon">
                      <MdInventory />
                    </div>
                    <span>My Products</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/supplier-portal/analytics" className={({isActive}) => isActive ? 'nav-item sub-nav-item active' : 'nav-item sub-nav-item'}>
                    <div className="nav-icon">
                      <MdInsertChart />
                    </div>
                    <span>Product Analytics</span>
                  </NavLink>
                </li>
              </ul>
            </li>
            
            <li className="nav-section">
              <h3>Communication</h3>
              <NavLink to="/supplier-portal/messages" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <div className="nav-icon">
                  <MdMessage />
                </div>
                <span>Messages</span>
                <div className="message-badge">3</div>
                <div className="indicator"></div>
              </NavLink>
            </li>
            
            <li className="nav-section">
              <h3>Account</h3>
              <div className="nav-item submenu-toggle" onClick={() => toggleMenu('account')}>
                <div className="nav-icon">
                  <MdAccountCircle />
                </div>
                <span>My Account</span>
                {expandedMenus.account ? <MdExpandLess /> : <MdExpandMore />}
              </div>
              <ul className={`submenu ${expandedMenus.account ? 'expanded' : ''}`}>
                <li>
                  <NavLink to="/supplier-portal/profile" className={({isActive}) => isActive ? 'nav-item sub-nav-item active' : 'nav-item sub-nav-item'}>
                    <div className="nav-icon">
                      <MdAccountCircle />
                    </div>
                    <span>Profile</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/supplier-portal/settings" className={({isActive}) => isActive ? 'nav-item sub-nav-item active' : 'nav-item sub-nav-item'}>
                    <div className="nav-icon">
                      <MdSettings />
                    </div>
                    <span>Settings</span>
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        
        <div className="tea-leaf-decoration"></div>
        
        <div className="sidebar-footer">
          <NavLink to="/supplier-portal/help" className="nav-item">
            <div className="nav-icon">
              <MdHelp />
            </div>
            <span>Help & Support</span>
          </NavLink>
          
          <button className="nav-item logout-button" onClick={handleLogout}>
            <div className="nav-icon">
              <MdLogout />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SupplierSidebar;