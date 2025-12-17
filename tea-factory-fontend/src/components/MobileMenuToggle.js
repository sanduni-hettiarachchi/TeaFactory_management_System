import React from 'react';
import { MdMenu, MdClose } from 'react-icons/md';
import './MobileMenuToggle.css';

const MobileMenuToggle = ({ isOpen, toggleMenu }) => {
  return (
    <button 
      className="sidebar-toggle" 
      onClick={toggleMenu}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      {isOpen ? <MdClose /> : <MdMenu />}
    </button>
  );
};

export default MobileMenuToggle;