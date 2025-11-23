import React, { useState, useEffect, useRef } from 'react';
import { vendorAPI, productAPI, reviewAPI } from '../services/api';
import { GOOGLE_MAPS_API_KEY } from '../services/config';
import './Search.css';

const Search = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchForm, setSearchForm] = useState({
    latitude: '',
    longitude: '',
    radius: 10,
    category: ''
  });
  const [userLocation, setUserLocation] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [currentUser, setCurrentUser] = useState(null);

  // Google Maps
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const loadGoogleMapsScript = () => {
    if (window.google && window.google.maps) return Promise.resolve();
    if (!GOOGLE_MAPS_API_KEY) return Promise.reject(new Error('Missing Google Maps API key'));

    return new Promise((resolve, reject) => {
      const existing = document.getElementById('google-maps-script');
      if (existing) {
        existing.addEventListener('load', resolve);
        existing.addEventListener('error', reject);
        if (window.google && window.google.maps) resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const initMap = (center) => {
    if (!mapRef.current) return;
    const defaultCenter = center || { lat: 37.7749, lng: -122.4194 }; // Fallback: San Francisco
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
  };

  const clearMarkers = () => {
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
  };

  const plotVendors = (vendorList) => {
    if (!mapInstanceRef.current || !window.google) return;
    clearMarkers();
    const bounds = new window.google.maps.LatLngBounds();

    vendorList.forEach(v => {
      if (typeof v.latitude === 'number' && typeof v.longitude === 'number') {
        const position = { lat: v.latitude, lng: v.longitude };
        const marker = new window.google.maps.Marker({
          position,
          map: mapInstanceRef.current,
          title: v.name,
        });
        const info = new window.google.maps.InfoWindow({
          content: `<div style="min-width:180px">
            <strong>${v.name || ''}</strong><br/>
            ${v.category || ''}<br/>
            ${v.address || ''}
          </div>`
        });
        marker.addListener('click', () => info.open({ map: mapInstanceRef.current, anchor: marker }));
        markersRef.current.push(marker);
        bounds.extend(position);
      }
    });

    if (vendorList.length > 0 && !bounds.isEmpty()) {
      mapInstanceRef.current.fitBounds(bounds);
    }
  };

  useEffect(() => {
    
    loadGoogleMapsScript()
      .then(() => {
        initMap();
        getCurrentLocation();
      })
      .catch(() => {
        
      });

  
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setSearchForm(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          if (window.google && window.google.maps && mapInstanceRef.current) {
            mapInstanceRef.current.setCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enter coordinates manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchForm.latitude || !searchForm.longitude) {
      setError('Please enter latitude and longitude');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      let response;
      if (searchForm.category) {
        response = await vendorAPI.getNearbyVendorsByCategory(
          searchForm.category,
          parseFloat(searchForm.latitude),
          parseFloat(searchForm.longitude),
          searchForm.radius
        );
      } else {
        response = await vendorAPI.getNearbyVendors(
          parseFloat(searchForm.latitude),
          parseFloat(searchForm.longitude),
          searchForm.radius
        );
      }
      
      setVendors(response.data);
      
      if (window.google && window.google.maps && mapInstanceRef.current) {
        plotVendors(response.data);
      }
    } catch (err) {
      setError('Failed to search vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleVendorClick = async (vendor) => {
    try {
      setProductsLoading(true);
      setSelectedVendor(vendor);
      const vendorId = vendor && (
        vendor.id ?? vendor.vendorId ?? vendor.vendor_id ?? vendor.vendorID
      );
      if (vendorId === undefined || vendorId === null) {
        console.error('Missing vendor id on vendor object:', vendor);
        setError('Unable to load products: vendor id is missing.');
        setVendorProducts([]);
        return;
      }
      const numericVendorId = typeof vendorId === 'number' ? vendorId : parseInt(vendorId, 10);
      if (Number.isNaN(numericVendorId)) {
        console.error('Vendor id is not a valid number:', vendorId, vendor);
        setError('Unable to load products: invalid vendor id.');
        setVendorProducts([]);
        return;
      }

      const response = await productAPI.getByVendor(numericVendorId);
      setVendorProducts(response.data);
    } catch (err) {
      console.error('Failed to load vendor products', err);
      const apiError = err?.response?.data?.error;
      setError(apiError || 'Failed to load vendor products');
    } finally {
      setProductsLoading(false);
    }
  };

  const handleBackToVendors = () => {
    setSelectedVendor(null);
    setVendorProducts([]);
    setSelectedProduct(null);
    setProductReviews([]);
    setShowReviewForm(false);
  };

  const handleProductClick = async (product) => {
    try {
      setReviewsLoading(true);
      setSelectedProduct(product);
      const response = await reviewAPI.getByProduct(product.id);
      setProductReviews(response.data);
    } catch (err) {
      setError('Failed to load product reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setProductReviews([]);
    setShowReviewForm(false);
  };

  const openDirections = (vendor) => {
    try {
      const vendorLat = typeof vendor.latitude === 'number' ? vendor.latitude : parseFloat(vendor.latitude);
      const vendorLng = typeof vendor.longitude === 'number' ? vendor.longitude : parseFloat(vendor.longitude);
      if (!vendorLat || !vendorLng) {
        setError('Vendor location is unavailable for directions');
        return;
      }

      const hasOrigin = userLocation && userLocation.latitude && userLocation.longitude;
      const originParam = hasOrigin ? `&origin=${encodeURIComponent(`${userLocation.latitude},${userLocation.longitude}`)}` : '';
      const destinationParam = `&destination=${encodeURIComponent(`${vendorLat},${vendorLng}`)}`;
      const url = `https://www.google.com/maps/dir/?api=1${originParam}${destinationParam}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      setError('Failed to open directions');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please login to add a review');
      return;
    }

    try {
      const reviewData = {
        userId: currentUser.id,
        productId: selectedProduct.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      };

      await reviewAPI.addReview(reviewData);
      
      
      const response = await reviewAPI.getByProduct(selectedProduct.id);
      setProductReviews(response.data);
      
      
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);
      setError('');
    } catch (err) {
      const apiError = err?.response?.data?.error;
      setError(apiError || 'Failed to submit review');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  const getAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
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
    <div className="search-page">
      <div className="container">
        <div className="search-header">
          <h1>Find Local Vendors</h1>
          <p>Discover vendors near your location</p>
        </div>

        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={searchForm.latitude}
                  onChange={(e) => setSearchForm({...searchForm, latitude: e.target.value})}
                  className="form-input"
                  placeholder="Enter latitude"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={searchForm.longitude}
                  onChange={(e) => setSearchForm({...searchForm, longitude: e.target.value})}
                  className="form-input"
                  placeholder="Enter longitude"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Radius (km)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={searchForm.radius}
                  onChange={(e) => setSearchForm({...searchForm, radius: parseInt(e.target.value)})}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category (optional)</label>
              <select
                value={searchForm.category}
                onChange={(e) => setSearchForm({...searchForm, category: e.target.value})}
                className="form-select"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={getCurrentLocation}>
                Use My Location
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Searching...' : 'Search Vendors'}
              </button>
            </div>
          </form>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="map-container">
            {GOOGLE_MAPS_API_KEY ? (
              <div id="map" ref={mapRef} style={{ width: '100%', height: '100%' }} />
            ) : (
              <div id="map" className="map-placeholder">
                <div className="map-placeholder-content">
                  <h3>Google Maps Integration</h3>
                  <p>Add your API key to .env as REACT_APP_GOOGLE_MAPS_API_KEY</p>
                </div>
              </div>
            )}
          </div>

          <div className="search-results">
            {selectedProduct ? (
              <div className="product-reviews">
                <div className="product-header">
                  <button className="btn btn-secondary" onClick={handleBackToProducts}>
                    ← Back to Products
                  </button>
                  <h2>{selectedProduct.name} - Reviews</h2>
                  <div className="product-rating">
                    <div className="rating-stars">
                      {renderStars(Math.round(getAverageRating(productReviews)))}
                    </div>
                    <span className="rating-text">
                      {getAverageRating(productReviews)} ({productReviews.length} reviews)
                    </span>
                  </div>
                </div>

                {currentUser && (
                  <div className="review-form-section">
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setShowReviewForm(!showReviewForm)}
                    >
                      {showReviewForm ? 'Cancel' : 'Add Review'}
                    </button>
                    
                    {showReviewForm && (
                      <form onSubmit={handleReviewSubmit} className="review-form">
                        <div className="form-group">
                          <label className="form-label">Rating</label>
                          <div className="rating-input">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                type="button"
                                className={`star-button ${star <= reviewForm.rating ? 'active' : ''}`}
                                onClick={() => setReviewForm({...reviewForm, rating: star})}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Comment</label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                            className="form-textarea"
                            placeholder="Share your experience with this product..."
                            rows="4"
                          />
                        </div>
                        <button type="submit" className="btn btn-primary">
                          Submit Review
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {reviewsLoading ? (
                  <div className="loading">Loading reviews...</div>
                ) : (
                  <div className="reviews-list">
                    {productReviews.map(review => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}

                {!reviewsLoading && productReviews.length === 0 && (
                  <div className="text-center">
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            ) : selectedVendor ? (
              <div className="vendor-products">
                <div className="vendor-header">
                  <button className="btn btn-secondary" onClick={handleBackToVendors}>
                    ← Back to Vendors
                  </button>
                  <h2>{selectedVendor.name} - Products</h2>
                  <p className="vendor-category">{selectedVendor.category}</p>
                </div>
                
                {productsLoading ? (
                  <div className="loading">Loading products...</div>
                ) : (
                  <div className="products-list">
                    {vendorProducts.map(product => (
                      <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
                    ))}
                  </div>
                )}

                {!productsLoading && vendorProducts.length === 0 && (
                  <div className="text-center">
                    <p>No products available from this vendor.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="vendors-section">
                <h2>Search Results ({vendors.length} vendors found)</h2>
                
                {loading ? (
                  <div className="loading">Searching for vendors...</div>
                ) : (
                  <div className="vendor-list">
                    {vendors.map(vendor => (
                      <VendorCard key={vendor.id} vendor={vendor} onVendorClick={handleVendorClick} onGetDirections={openDirections} />
                    ))}
                  </div>
                )}

                {!loading && vendors.length === 0 && (
                  <div className="text-center">
                    <p>No vendors found in the specified area. Try expanding your search radius.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const VendorCard = ({ vendor, onVendorClick, onGetDirections }) => {
  return (
    <div className="vendor-card">
      <div className="vendor-info">
        <h3>{vendor.name}</h3>
        <p className="vendor-category">{vendor.category}</p>
        <p className="vendor-email">{vendor.email}</p>
        {vendor.phone && <p className="vendor-phone">📞 {vendor.phone}</p>}
        {vendor.address && <p className="vendor-address">📍 {vendor.address}</p>}
        {vendor.description && <p className="vendor-description">{vendor.description}</p>}
      </div>
      <div className="vendor-actions">
        <button className="btn btn-primary" onClick={() => onVendorClick(vendor)}>
          View Products
        </button>
        <button className="btn btn-outline" onClick={() => onGetDirections(vendor)}>Get Directions</button>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onProductClick }) => {
  return (
    <div className="product-card">
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-description">{product.description}</p>
        <div className="product-details">
          <span className="product-price">${product.price}</span>
          {product.availability && (
            <span className={`availability ${product.availability.toLowerCase()}`}>
              {product.availability}
            </span>
          )}
        </div>
      </div>
      <div className="product-actions">
        <button className="btn btn-primary" onClick={() => onProductClick(product)}>
          View Reviews
        </button>
      </div>
    </div>
  );
};

const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) return 'N/A';

    const day = parsedDate.getDate().toString().padStart(2, '0');
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  const formattedDate = formatDate(review.createdAt);

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-rating">
          {renderStars(review.rating)}
        </div>
        {formattedDate !== 'N/A' && (
          <div className="review-date">
            {formattedDate}
          </div>
        )}
      </div>
      {review.comment && (
        <div className="review-comment">
          <p>{review.comment}</p>
        </div>
      )}
    </div>
  );
};

export default Search;
