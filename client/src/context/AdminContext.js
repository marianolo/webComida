import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin debe ser usado dentro de AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un admin logueado al cargar
    const savedAdmin = localStorage.getItem('adminData');
    const savedToken = localStorage.getItem('adminToken');
    
    if (savedAdmin && savedToken) {
      try {
        const adminData = JSON.parse(savedAdmin);
        setAdmin({ ...adminData, token: savedToken });
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('adminData');
        localStorage.removeItem('adminToken');
      }
    }
    setLoading(false);
  }, []);

  const loginAdmin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('adminData', JSON.stringify(adminData.admin));
    localStorage.setItem('adminToken', adminData.token);
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminToken');
  };

  const isAdmin = () => {
    return admin !== null;
  };

  const value = {
    admin,
    loginAdmin,
    logoutAdmin,
    isAdmin,
    loading
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;