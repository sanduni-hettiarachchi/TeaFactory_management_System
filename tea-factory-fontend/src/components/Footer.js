import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <span>© 2024 Tea Factory Ltd. All rights reserved.</span>
        </div>
        <div className="footer-links">
          <span>System Status: <span className="status-online">Online</span></span>
          <span>Last Update: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;