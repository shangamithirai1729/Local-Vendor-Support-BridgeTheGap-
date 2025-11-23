import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    
    loadUser();

    
    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    
    
    window.addEventListener('userLogin', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowProfileDropdown(false);
    navigate('/');
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const closeProfileDropdown = () => {
    setShowProfileDropdown(false);
  };

  const getDashboardLink = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'USER':
        return '/user/dashboard';
      case 'VENDOR':
        return '/vendor/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return null;
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            BridgeTheGap
          </Link>
          
          <ul className="navbar-nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search</Link></li>
            
            {user ? (
              <li className="profile-dropdown-container" ref={dropdownRef}>
                <button 
                  className="profile-button" 
                  onClick={toggleProfileDropdown}
                >
                  <div className="profile-icon">
                    <span className="profile-initial">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <span className="profile-name">{user.name}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {showProfileDropdown && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <div className="profile-info">
                        <div className="profile-icon-large">
                          <span className="profile-initial-large">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div className="profile-details">
                          <div className="profile-name-large">{user.name}</div>
                          <div className="profile-role">{user.role}</div>
                        </div>
                      </div>
                    </div>
                    <div className="profile-dropdown-menu">
                      <Link 
                        to={getDashboardLink()} 
                        className="dropdown-item"
                        onClick={closeProfileDropdown}
                      >
                        <span className="dropdown-icon">👤</span>
                        My Profile
                      </Link>
                      <button 
                        className="dropdown-item logout-item"
                        onClick={handleLogout}
                      >
                        <span className="dropdown-icon">🚪</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ) : (
              <>
                <li><Link to="/user/login" className="btn btn-outline">User Login</Link></li>
                <li><Link to="/vendor/login" className="btn btn-outline">Vendor Login</Link></li>
                <li><Link to="/admin/login" className="btn btn-primary">Admin Login</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
