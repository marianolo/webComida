import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRouteAdmin({ children }) {
  const admin = JSON.parse(localStorage.getItem('admin'));

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default PrivateRouteAdmin;
