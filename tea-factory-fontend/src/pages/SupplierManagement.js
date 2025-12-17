import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './SupplierManagement.css';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    leadTime: 7,
    paymentTerms: '',
    status: 'active',
    suppliedItems: []
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [suppliers, searchTerm, statusFilter]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSuppliers = () => {
    let filtered = suppliers;

    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.supplierId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(supplier => supplier.status === statusFilter);
    }

    setFilteredSuppliers(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier.supplierId}`, formData);
        alert('Supplier updated successfully!');
      } else {
        await api.post('/suppliers', formData);
        alert('Supplier created successfully!');
      }
      
      setShowModal(false);
      setEditingSupplier(null);
      resetForm();
      fetchSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Failed to save supplier. Please try again.');
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson || '',
      email: supplier.email,
      phone: supplier.phone || '',
      address: supplier.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      leadTime: supplier.leadTime || 7,
      paymentTerms: supplier.paymentTerms || '',
      status: supplier.status,
      suppliedItems: supplier.suppliedItems || []
    });
    setShowModal(true);
  };

  const handleDelete = async (supplierId) => {
    if (window.confirm('Are you sure you want to delete this supplier? This action cannot be undone.')) {
      try {
        await api.delete(`/suppliers/${supplierId}`);
        alert('Supplier deleted successfully!');
        fetchSuppliers();
      } catch (error) {
        console.error('Error deleting supplier:', error);
        
        // Handle specific error cases
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          
          if (errorData.hasAssociatedItems) {
            alert(`Cannot delete supplier: ${errorData.message}`);
          } else if (errorData.hasActivePurchaseOrders) {
            alert(`Cannot delete supplier: ${errorData.message}`);
          } else {
            alert(`Failed to delete supplier: ${errorData.message}`);
          }
        } else {
          alert('Failed to delete supplier. Please try again.');
        }
      }
    }
  };

  const handleDeactivate = async (supplierId) => {
    if (window.confirm('Are you sure you want to deactivate this supplier? This will make them unavailable for new orders.')) {
      try {
        await api.patch(`/suppliers/${supplierId}/deactivate`);
        alert('Supplier deactivated successfully!');
        fetchSuppliers();
      } catch (error) {
        console.error('Error deactivating supplier:', error);
        alert('Failed to deactivate supplier. Please try again.');
      }
    }
  };

  const handleReactivate = async (supplierId) => {
    if (window.confirm('Are you sure you want to reactivate this supplier?')) {
      try {
        await api.patch(`/suppliers/${supplierId}/reactivate`);
        alert('Supplier reactivated successfully!');
        fetchSuppliers();
      } catch (error) {
        console.error('Error reactivating supplier:', error);
        alert('Failed to reactivate supplier. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      leadTime: 7,
      paymentTerms: '',
      status: 'active',
      suppliedItems: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (loading) {
    return (
      <div className="supplier-management">
        <div className="page-header">
          <h2>Supplier Management</h2>
        </div>
        <div className="loading">Loading suppliers...</div>
      </div>
    );
  }

  return (
    <div className="supplier-management">
      <div className="page-header">
        <h2>Supplier Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingSupplier(null);
            resetForm();
            setShowModal(true);
          }}
        >
          ➕ Add New Supplier
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-box">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="suppliers-table-container">
        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Supplier ID</th>
              <th>Name</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Lead Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map(supplier => (
              <tr key={supplier._id}>
                <td className="supplier-id">{supplier.supplierId}</td>
                <td className="supplier-name">{supplier.name}</td>
                <td>{supplier.contactPerson || 'N/A'}</td>
                <td className="email">{supplier.email}</td>
                <td>{supplier.phone || 'N/A'}</td>
                <td>{supplier.leadTime} days</td>
                <td>
                  <span className={`status-badge ${supplier.status}`}>
                    {supplier.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-small btn-info"
                      onClick={() => handleEdit(supplier)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    
                    {supplier.status === 'active' ? (
                      <button 
                        className="btn-small btn-warning"
                        onClick={() => handleDeactivate(supplier.supplierId)}
                        title="Deactivate"
                      >
                        🚫
                      </button>
                    ) : (
                      <button 
                        className="btn-small btn-success"
                        onClick={() => handleReactivate(supplier.supplierId)}
                        title="Reactivate"
                      >
                        ✅
                      </button>
                    )}
                    
                    <button 
                      className="btn-small btn-danger"
                      onClick={() => handleDelete(supplier.supplierId)}
                      title="Delete (Permanent)"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSuppliers.length === 0 && (
          <div className="no-data">
            <p>No suppliers found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Supplier Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contact Person</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Zip Code</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Lead Time (days)</label>
                  <input
                    type="number"
                    name="leadTime"
                    value={formData.leadTime}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Payment Terms</label>
                <textarea
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSupplier ? 'Update' : 'Create'} Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManagement;