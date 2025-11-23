import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, allowedRoles }) => {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    
    const fallback =
      user.role === 'ADMIN' ? '/admin/dashboard' :
      user.role === 'VENDOR' ? '/vendor/dashboard' :
      user.role === 'USER' ? '/user/dashboard' : '/';
    return <Navigate to={fallback} replace />;
  }

  return <Element />;
};

export default ProtectedRoute;


