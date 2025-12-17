import React from 'react';
import { useAuth } from '../contex/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const { currentUser, logout, isAdmin, isSupplier } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate(isSupplier() ? '/supplier-login' : '/imanagerlogin');
  };
  
  return (
    <header className="header">
      <div className="header-brand">
        <h1>TeaFactory</h1>
        {isSupplier() && <span className="portal-badge">Supplier Portal</span>}
      </div>
      
      {currentUser && (
        <div className="user-controls">
          <div className="user-info">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-role">{isAdmin() ? 'Administrator' : 'Supplier'}</span>
          </div>
          
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;