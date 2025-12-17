import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const ProfileDropdown = ({ user, logout, toggleTheme }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="profile-dropdown-container">
      <img
        src={user.profilePhoto || '/default-avatar.png'}
        alt="Profile"
        className="profile-avatar"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="dropdown-menu">
          <button onClick={() => navigate('/edit-profile')} className="dropdown-item">Edit Profile</button>
          <button onClick={toggleTheme} className="dropdown-item">Toggle Dark Mode</button>
          <button onClick={logout} className="dropdown-item">Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;