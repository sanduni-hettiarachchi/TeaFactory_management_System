
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contex/AuthContext';
import './SupplierLogin.css';

const SupplierLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Authenticate with backend
      const response = await api.post('/auth/supplier/login', credentials);
      
      // Format user data for authentication context
      const userData = {
        id: response.data.supplierId,
        name: response.data.name,
        email: response.data.email,
        role: 'supplier', // Important: set role to supplier
        token: response.data.token
      };
      
      // Use the login method from auth context
      login(userData);
      
      // Navigate to supplier portal
      navigate('/supplier-portal');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="supplier-login-container">
      <div className="supplier-login-card">
        <div className="login-header">
          <h2>Supplier Portal</h2>
          <p>Login to access your dashboard</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>
        
        <div className="login-footer">
          <p>Forgot your password? <a href="/supplier-reset-password">Reset it here</a></p>
          <p>Don't have an account? <Link to="/supplier-register">Register as Supplier</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SupplierLogin;
