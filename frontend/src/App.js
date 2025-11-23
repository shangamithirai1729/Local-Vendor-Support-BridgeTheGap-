import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import VendorLogin from './pages/VendorLogin';
import VendorRegister from './pages/VendorRegister';
import AdminLogin from './pages/AdminLogin';
import UserDashboard from './pages/UserDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Search from './pages/Search';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/vendor/login" element={<VendorLogin />} />
            <Route path="/vendor/register" element={<VendorRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/user/dashboard"
              element={<ProtectedRoute element={UserDashboard} allowedRoles={['USER']} />}
            />
            <Route
              path="/vendor/dashboard"
              element={<ProtectedRoute element={VendorDashboard} allowedRoles={['VENDOR']} />}
            />
            <Route
              path="/admin/dashboard"
              element={<ProtectedRoute element={AdminDashboard} allowedRoles={['ADMIN']} />}
            />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
