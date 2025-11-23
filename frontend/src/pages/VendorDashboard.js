import React, { useState, useEffect } from 'react';
import { productAPI, vendorAPI } from '../services/api';
import './Dashboard.css';

const VendorDashboard = () => {
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: ''
  });
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    category: '',
    description: '',
    phone: '',
    address: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const vendorObj = JSON.parse(userData);
      setVendor(vendorObj);
      setProfileForm({
        name: vendorObj.name || '',
        email: vendorObj.email || '',
        category: vendorObj.category || '',
        description: vendorObj.description || '',
        phone: vendorObj.phone || '',
        address: vendorObj.address || '',
        latitude: vendorObj.latitude || '',
        longitude: vendorObj.longitude || ''
      });
      loadProducts();
    }
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await productAPI.getByVendor(user.id);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const productData = {
        ...productForm,
        vendorId: user.id,
        price: parseFloat(productForm.price)
      };

      if (editingProduct) {
        await productAPI.updateProduct(editingProduct.id, productData);
      } else {
        await productAPI.addProduct(productData);
      }

      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: '', category: '', imageUrl: '' });
      loadProducts();
    } catch (err) {
      setError('Failed to save product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || '',
      imageUrl: product.imageUrl || ''
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(productId);
        loadProducts();
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const currentVendor = JSON.parse(localStorage.getItem('user'));
      const updatedVendorPayload = {
        name: profileForm.name,
        email: profileForm.email,
        category: profileForm.category,
        description: profileForm.description,
        phone: profileForm.phone,
        address: profileForm.address,
        latitude: profileForm.latitude ? parseFloat(profileForm.latitude) : null,
        longitude: profileForm.longitude ? parseFloat(profileForm.longitude) : null
      };

      
      await Promise.all([
        vendorAPI.updateVendor(currentVendor.id, {
          name: updatedVendorPayload.name,
          email: updatedVendorPayload.email,
          category: updatedVendorPayload.category,
          description: updatedVendorPayload.description,
          phone: updatedVendorPayload.phone,
          address: updatedVendorPayload.address
        }),
        updatedVendorPayload.latitude != null && updatedVendorPayload.longitude != null
          ? vendorAPI.updateLocation(currentVendor.id, { latitude: updatedVendorPayload.latitude, longitude: updatedVendorPayload.longitude })
          : Promise.resolve()
      ]);

      const updatedVendorLocal = { ...currentVendor, ...updatedVendorPayload };
      localStorage.setItem('user', JSON.stringify(updatedVendorLocal));
      setVendor(updatedVendorLocal);
      
      window.dispatchEvent(new Event('userLogin'));
      setShowProfileForm(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setProfileForm({
            ...profileForm,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
        },
        (error) => {
          alert('Unable to get your location. Please enter coordinates manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const categories = [
    'Food & Beverage',
    'Retail',
    'Services',
    'Healthcare',
    'Automotive',
    'Beauty & Wellness',
    'Home & Garden',
    'Technology',
    'Education',
    'Other'
  ];

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Vendor Dashboard</h1>
          <div className="dashboard-actions">
            <button 
              className="btn btn-outline"
              onClick={() => setShowProfileForm(true)}
            >
              Edit Profile
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setShowProductForm(true)}
            >
              Add Product
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="vendor-info">
          <h2>Business Information</h2>
          <div className="card">
            <div className="vendor-details">
              <h3>{vendor?.name}</h3>
              <p><strong>Category:</strong> {vendor?.category}</p>
              <p><strong>Email:</strong> {vendor?.email}</p>
              {vendor?.phone && <p><strong>Phone:</strong> {vendor.phone}</p>}
              {vendor?.address && <p><strong>Address:</strong> {vendor.address}</p>}
              {vendor?.description && <p><strong>Description:</strong> {vendor.description}</p>}
            </div>
            <button className="btn btn-outline" onClick={() => setShowProfileForm(true)}>Edit Profile</button>
          </div>
        </div>

        <div className="products-section">
          <h2>My Products & Services</h2>
          
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                  )}
                  <div className="product-content">
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price">${product.price}</div>
                    <div className="product-category">{product.category}</div>
                    
                    <div className="product-actions">
                      <button 
                        className="btn btn-outline"
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center">
              <p>No products added yet. Click "Add Product" to get started!</p>
            </div>
          )}
        </div>

        {showProductForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button 
                  className="btn-close"
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                    setProductForm({ name: '', description: '', price: '', category: '', imageUrl: '' });
                  }}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleProductSubmit} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    className="form-textarea"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="form-select"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL (optional)</label>
                  <input
                    type="url"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({...productForm, imageUrl: e.target.value})}
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowProductForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showProfileForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Edit Vendor Profile</h3>
                <button 
                  className="btn-close"
                  onClick={() => setShowProfileForm(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleProfileUpdate} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Business Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={profileForm.category}
                    onChange={(e) => setProfileForm({...profileForm, category: e.target.value})}
                    className="form-select"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={profileForm.description}
                    onChange={(e) => setProfileForm({...profileForm, description: e.target.value})}
                    className="form-textarea"
                    rows="3"
                    placeholder="Describe your business..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                    className="form-textarea"
                    rows="2"
                    placeholder="Enter your business address..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location (for customer discovery)</label>
                  <div className="location-inputs">
                    <input
                      type="number"
                      step="any"
                      value={profileForm.latitude}
                      onChange={(e) => setProfileForm({...profileForm, latitude: e.target.value})}
                      className="form-input"
                      placeholder="Latitude"
                    />
                    <input
                      type="number"
                      step="any"
                      value={profileForm.longitude}
                      onChange={(e) => setProfileForm({...profileForm, longitude: e.target.value})}
                      className="form-input"
                      placeholder="Longitude"
                    />
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={getCurrentLocation}
                    >
                      Use My Location
                    </button>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowProfileForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
