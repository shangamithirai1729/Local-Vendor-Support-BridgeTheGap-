import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // User auth
  registerUser: (userData) => api.post('/auth/user/register', userData),
  loginUser: (credentials) => api.post('/auth/user/login', credentials),
  
  // Vendor auth
  registerVendor: (vendorData) => api.post('/auth/vendor/register', vendorData),
  loginVendor: (credentials) => api.post('/auth/vendor/login', credentials),
  
  // Admin auth
  loginAdmin: (credentials) => api.post('/auth/admin/login', credentials),
};

// User API
export const userAPI = {
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  updateLocation: (id, locationData) => api.put(`/users/${id}/location`, locationData),
  getNearbyUsers: (lat, lng, radius) => api.get(`/users/nearby?latitude=${lat}&longitude=${lng}&radiusKm=${radius}`),
};

// Vendor API
export const vendorAPI = {
  getVendor: (id) => api.get(`/vendors/${id}`),
  updateVendor: (id, vendorData) => api.put(`/vendors/${id}`, vendorData),
  deleteVendor: (id) => api.delete(`/vendors/${id}`),
  getByCategory: (category) => api.get(`/vendors/category/${category}`),
  updateLocation: (id, locationData) => api.put(`/vendors/${id}/location`, locationData),
  getNearbyVendors: (lat, lng, radius) => api.get(`/vendors/nearby?latitude=${lat}&longitude=${lng}&radiusKm=${radius}`),
  getNearbyVendorsByCategory: (category, lat, lng, radius) => 
    api.get(`/vendors/nearby/category/${category}?latitude=${lat}&longitude=${lng}&radiusKm=${radius}`),
};

// Product API
export const productAPI = {
  addProduct: (productData) => api.post('/products', productData),
  getAllProducts: () => api.get('/products'),
  getProduct: (id) => api.get(`/products/${id}`),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getByVendor: (vendorId) => api.get(`/products/vendor/${vendorId}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  searchProducts: (query) => api.get(`/products/search?q=${query}`),
};

// Review API
export const reviewAPI = {
  addReview: (reviewData) => api.post('/reviews', reviewData),
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  getByUser: (userId) => api.get(`/reviews/user/${userId}`),
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  getProductRating: (productId) => api.get(`/reviews/product/${productId}/rating`),
};

// Admin API
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllVendors: () => api.get('/admin/vendors'),
  deleteVendor: (id) => api.delete(`/admin/vendors/${id}`),
  getAllProducts: () => api.get('/admin/products'),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getAllReviews: () => api.get('/admin/reviews'),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
  activateProduct: (productId) => api.put(`/admin/products/${productId}/activate`),
  activateVendorProducts: (vendorId) => api.put(`/admin/vendors/${vendorId}/products/activate`),
};

export default api;
