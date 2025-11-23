import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      switch (activeTab) {
        case 'users':
          const usersResponse = await adminAPI.getAllUsers();
          setUsers(usersResponse.data);
          break;
        case 'vendors':
          const vendorsResponse = await adminAPI.getAllVendors();
          setVendors(vendorsResponse.data);
          break;
        case 'products':
          const productsResponse = await adminAPI.getAllProducts();
          setProducts(productsResponse.data);
          break;
        case 'reviews':
          const reviewsResponse = await adminAPI.getAllReviews();
          setReviews(reviewsResponse.data);
          break;
        default:
          break;
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        switch (type) {
          case 'user':
            await adminAPI.deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
            break;
          case 'vendor':
            await adminAPI.deleteVendor(id);
            setVendors(vendors.filter(v => v.id !== id));
            break;
          case 'product':
            await adminAPI.deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
            break;
          case 'review':
            await adminAPI.deleteReview(id);
            setReviews(reviews.filter(r => r.id !== id));
            break;
          default:
            break;
        }
      } catch (err) {
        setError(`Failed to delete ${type}`);
      }
    }
  };

  const formatDateDDMMYYYY = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getRelativeDateLabel = (dateStr, fallbackDate = null) => {
    if (!dateStr) {
      if (fallbackDate) {
        return formatDateDDMMYYYY(fallbackDate);
      }
      return '-';
    }
    const parsedDate = new Date(dateStr);
    if (isNaN(parsedDate.getTime())) {
      if (fallbackDate) {
        return formatDateDDMMYYYY(fallbackDate);
      }
      return '-';
    }

    return formatDateDDMMYYYY(parsedDate);
  };

  const renderUsers = () => (
    <div className="admin-table">
      <div className="table-header">
        <h3>Users ({users.length})</h3>
      </div>
      <div className="table-content">
        {users.map(user => (
          <div key={user.id} className="table-row">
            <div className="table-cell">
              <strong>{user.name}</strong>
              <br />
              <small>{user.email}</small>
            </div>
            <div className="table-cell">
              {user.latitude && user.longitude ? 'Location Set' : 'No Location'}
            </div>
            <div className="table-cell">{getRelativeDateLabel(user.createdAt)}</div>
            <div className="table-cell">
              <button 
                className="btn btn-danger"
                onClick={() => handleDelete('user', user.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVendors = () => (
    <div className="admin-table">
      <div className="table-header">
        <h3>Vendors ({vendors.length})</h3>
      </div>
      <div className="table-content">
        {vendors.map(vendor => (
          <div key={vendor.id} className="table-row">
            <div className="table-cell">
              <strong>{vendor.name}</strong>
              <br />
              <small>{vendor.email}</small>
              <br />
              <span className="category-badge">{vendor.category}</span>
            </div>
            <div className="table-cell">
              {vendor.latitude && vendor.longitude ? 'Location Set' : 'No Location'}
            </div>
            <div className="table-cell">{getRelativeDateLabel(vendor.createdAt)}</div>
            <div className="table-cell">
              <button 
                className="btn btn-danger"
                onClick={() => handleDelete('vendor', vendor.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="admin-table">
      <div className="table-header">
        <h3>Products ({products.length})</h3>
        <div className="table-actions">
          <button
            className="btn btn-primary"
            onClick={async () => {
              const vendorIdStr = window.prompt('Enter Vendor ID to activate all products:');
              if (!vendorIdStr) return;
              const vendorId = parseInt(vendorIdStr, 10);
              if (Number.isNaN(vendorId)) {
                alert('Invalid Vendor ID');
                return;
              }
              try {
                await adminAPI.activateVendorProducts(vendorId);
                // reload products
                const productsResponse = await adminAPI.getAllProducts();
                setProducts(productsResponse.data);
              } catch {
                setError('Failed to activate vendor products');
              }
            }}
          >
            Activate All For Vendor
          </button>
        </div>
      </div>
      <div className="table-content">
        {products.map(product => (
          <div key={product.id} className="table-row">
            <div className="table-cell">
              <strong>{product.name}</strong>
              <br />
              <small>{product.description}</small>
              <br />
              <span className="category-badge">{product.category}</span>
            </div>
            <div className="table-cell">
              <strong>${product.price}</strong>
            </div>
            <div className="table-cell">{product.isActive ? 'Active' : 'Inactive'}</div>
            <div className="table-cell">{getRelativeDateLabel(product.createdAt, new Date())}</div>
            <div className="table-cell">
              <button 
                className="btn btn-danger"
                onClick={() => handleDelete('product', product.id)}
              >
                Delete
              </button>
              {!product.isActive && (
                <button
                  className="btn btn-primary"
                  style={{ marginLeft: '8px' }}
                  onClick={async () => {
                    try {
                      const updated = await adminAPI.activateProduct(product.id);
                      setProducts(products.map(p => p.id === product.id ? updated.data : p));
                    } catch {
                      setError('Failed to activate product');
                    }
                  }}
                >
                  Activate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="admin-table">
      <div className="table-header">
        <h3>Reviews ({reviews.length})</h3>
      </div>
      <div className="table-content">
        {reviews.map(review => (
          <div key={review.id} className="table-row">
            <div className="table-cell">
              <div className="rating">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={`star ${i < review.rating ? '' : 'empty'}`}>
                    ★
                  </span>
                ))}
              </div>
              <br />
              <small>{review.comment}</small>
            </div>
            <div className="table-cell">
              User ID: {review.userId}
              <br />
              Product ID: {review.productId}
            </div>
            <div className="table-cell">{getRelativeDateLabel(review.createdAt, (() => {
              const d = new Date();
              d.setDate(d.getDate() - 1);
              return d;
            })())}</div>
            <div className="table-cell">
              <button 
                className="btn btn-danger"
                onClick={() => handleDelete('review', review.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`tab-button ${activeTab === 'vendors' ? 'active' : ''}`}
            onClick={() => setActiveTab('vendors')}
          >
            Vendors
          </button>
          <button 
            className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button 
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="loading">Loading {activeTab}...</div>
          ) : (
            <>
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'vendors' && renderVendors()}
              {activeTab === 'products' && renderProducts()}
              {activeTab === 'reviews' && renderReviews()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
