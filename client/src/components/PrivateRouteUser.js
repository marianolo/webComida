import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UsuarioContext } from '../context/UsuarioContext';

function PrivateRouteUser({ children }) {
  const { usuario } = useContext(UsuarioContext);
  const location = useLocation();

  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRouteUser;
