import React, { useState, useEffect } from 'react';
import { productAPI, reviewAPI, userAPI } from '../services/api';
import './Dashboard.css';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      setProfileForm({
        name: userObj.name || '',
        email: userObj.email || '',
        latitude: userObj.latitude || '',
        longitude: userObj.longitude || ''
      });
    }
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUserPayload = {
        name: profileForm.name,
        email: profileForm.email,
        latitude: profileForm.latitude ? parseFloat(profileForm.latitude) : null,
        longitude: profileForm.longitude ? parseFloat(profileForm.longitude) : null
      };

      // Persist to backend
      await Promise.all([
        updatedUserPayload.latitude != null && updatedUserPayload.longitude != null
          ? userAPI.updateLocation(currentUser.id, { latitude: updatedUserPayload.latitude, longitude: updatedUserPayload.longitude })
          : Promise.resolve(),
        userAPI.updateUser(currentUser.id, { name: updatedUserPayload.name, email: updatedUserPayload.email })
      ]);

      const updatedUser = { ...currentUser, ...updatedUserPayload };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      // notify navbar
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

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome, {user?.name}!</h1>
          <div className="dashboard-actions">
            <button className="btn btn-outline" onClick={() => setShowProfileForm(true)}>
              Edit Profile
            </button>
            <button className="btn btn-primary" onClick={() => window.location.href = '/search'}>
              Search Vendors
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="search-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="products-section">
          <h2>Available Products & Services</h2>
          
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center">
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </div>

        {showProfileForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Edit Profile</h3>
                <button 
                  className="btn-close"
                  onClick={() => setShowProfileForm(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleProfileUpdate} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
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
                  <label className="form-label">Location (for vendor search)</label>
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

const ProductCard = ({ product }) => {
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    loadProductRating();
  }, [product.id]);

  const loadProductRating = async () => {
    try {
      const response = await reviewAPI.getProductRating(product.id);
      const data = response.data;
      setRating(data.averageRating || 0);
      setReviewCount(data.reviewCount || 0);
    } catch (err) {
      console.error('Failed to load rating:', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await reviewAPI.addReview({
        userId: user.id,
        productId: product.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '' });
      loadProductRating();
    } catch (err) {
      alert('Failed to submit review');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? '' : 'empty'}`}>
        ★
      </span>
    ));
  };

  const formattedPrice = typeof product.price === 'number'
    ? product.price.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
    : `$${product.price}`;

  const getInitials = (name) => {
    if (!name) return 'P';
    const segments = name.trim().split(' ').filter(Boolean);
    if (segments.length === 0) return 'P';
    if (segments.length === 1) return segments[0].charAt(0).toUpperCase();
    return `${segments[0].charAt(0)}${segments[segments.length - 1].charAt(0)}`.toUpperCase();
  };

  return (
    <div className="product-card">
      <div className="product-icon-wrapper">
        <div className="product-icon">{getInitials(product.name)}</div>
      </div>
      <div className="product-content">
        <div className="product-header-row">
          <h3 className="product-title">{product.name}</h3>
          {product.category && <span className="category-badge">{product.category}</span>}
        </div>
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}

        <div className="product-meta-row">
          <div className="product-price">{formattedPrice}</div>
          <div className="product-rating">
            <div className="rating">
              {renderStars(Math.round(rating))}
              <span>({reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        <div className="product-actions">
          <button 
            className="btn btn-outline"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? 'Cancel Review' : 'Add Review'}
          </button>
        </div>

        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="review-form">
            <div className="form-group">
              <label className="form-label">Rating</label>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
                className="form-select"
              >
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Comment</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                className="form-textarea"
                placeholder="Write your review..."
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
