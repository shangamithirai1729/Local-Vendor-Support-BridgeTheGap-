import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>BridgeTheGap</h1>
          <p>Connecting local vendors with customers in your community</p>
          <div className="hero-buttons">
            <Link to="/user/register" className="btn btn-primary">
              Join as Customer
            </Link>
            <Link to="/vendor/register" className="btn btn-outline">
              Join as Vendor
            </Link>
            <Link to="/search" className="btn btn-secondary">
              Search Vendors
            </Link>
            <Link to="/admin/login" className="btn btn-success">
              Admin Login
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose BridgeTheGap?</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🏪</div>
              <h3>Local Vendors</h3>
              <p>Discover and support local businesses in your area. Find everything from groceries to services right in your neighborhood.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3>Location-Based Search</h3>
              <p>Find vendors within your preferred distance using our advanced location search powered by Google Maps integration.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Reviews & Ratings</h3>
              <p>Read authentic reviews from other customers and share your own experiences to help the community make informed decisions.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🛒</div>
              <h3>Easy Shopping</h3>
              <p>Browse products and services from local vendors, compare prices, and make informed purchasing decisions.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Vendor Dashboard</h3>
              <p>Vendors get powerful tools to manage their profile, products, and customer interactions all in one place.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Platform</h3>
              <p>Your data and transactions are protected with enterprise-grade security and privacy measures.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of customers and vendors who are already using BridgeTheGap to connect and grow their local communities.</p>
            <div className="cta-buttons">
              <Link to="/user/register" className="btn btn-primary">
                Sign Up as Customer
              </Link>
              <Link to="/vendor/register" className="btn btn-outline">
                Sign Up as Vendor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
