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
    console.log('🔄 AdminContext inicializando...');
    
    // Verificar si hay un admin logueado al cargar
    const savedAdmin = localStorage.getItem('adminData');
    const savedToken = localStorage.getItem('adminToken');
    
    console.log('📦 Datos guardados:', {
      adminData: savedAdmin ? 'Presente' : 'No data',
      adminToken: savedToken ? `${savedToken.substring(0, 20)}...` : 'No token'
    });
    
    if (savedAdmin && savedToken) {
      try {
        const adminData = JSON.parse(savedAdmin);
        
        // Verificar si el token no ha expirado
        const tokenParts = savedToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const isExpired = Date.now() >= payload.exp * 1000;
          
          if (isExpired) {
            console.warn('⚠️ Token de admin expirado');
            localStorage.removeItem('adminData');
            localStorage.removeItem('adminToken');
            setAdmin(null);
          } else {
            console.log('✅ Admin restaurado desde localStorage');
            setAdmin({ 
              ...adminData, 
              token: savedToken,
              // Asegurar que tenemos los campos necesarios
              id: adminData.id,
              email: adminData.email,
              nombre: adminData.nombre,
              activo: adminData.activo !== false
            });
          }
        } else {
          console.error('❌ Token de admin malformado');
          localStorage.removeItem('adminData');
          localStorage.removeItem('adminToken');
        }
      } catch (error) {
        console.error('❌ Error parsing admin data:', error);
        localStorage.removeItem('adminData');
        localStorage.removeItem('adminToken');
      }
    } else {
      console.log('ℹ️ No hay datos de admin guardados');
    }
    
    setLoading(false);
  }, []);

  const loginAdmin = (loginResponse) => {
    console.log('🔐 Login de admin:', loginResponse);
    
    // Asegurar que tenemos la estructura correcta
    const adminData = loginResponse.admin || loginResponse.user || loginResponse;
    const token = loginResponse.token;
    
    if (!token) {
      console.error('❌ No se recibió token en el login');
      throw new Error('No se recibió token de autenticación');
    }
    
    if (!adminData.id) {
      console.error('❌ No se recibieron datos del admin');
      throw new Error('No se recibieron datos del administrador');
    }
    
    // Crear objeto admin completo
    const adminCompleto = {
      ...adminData,
      token: token,
      // Asegurar campos requeridos
      id: adminData.id,
      email: adminData.email || adminData.usuario,
      nombre: adminData.nombre || adminData.email || 'Admin',
      activo: adminData.activo !== false
    };
    
    console.log('✅ Guardando admin:', {
      id: adminCompleto.id,
      email: adminCompleto.email,
      nombre: adminCompleto.nombre,
      token: token ? `${token.substring(0, 20)}...` : 'No token'
    });
    
    setAdmin(adminCompleto);
    
    // Guardar en localStorage
    localStorage.setItem('adminData', JSON.stringify({
      id: adminCompleto.id,
      email: adminCompleto.email,
      nombre: adminCompleto.nombre,
      activo: adminCompleto.activo
    }));
    localStorage.setItem('adminToken', token);
    
    // Verificar que se guardó correctamente
    setTimeout(() => {
      const verificacion = localStorage.getItem('adminToken');
      console.log('🔍 Verificación de guardado:', verificacion ? 'Token guardado' : 'ERROR: Token no guardado');
    }, 100);
  };

  const logoutAdmin = () => {
    console.log('🚪 Logout de admin');
    setAdmin(null);
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminToken');
    
    // Verificar que se eliminó
    setTimeout(() => {
      const verificacion = localStorage.getItem('adminToken');
      console.log('🔍 Verificación de logout:', verificacion ? 'ERROR: Token no eliminado' : 'Logout exitoso');
    }, 100);
  };

  const isAdmin = () => {
    const result = admin !== null && admin.token;
    console.log('🤔 ¿Es admin?', result, { admin: admin ? 'Presente' : 'No admin', token: admin?.token ? 'Con token' : 'Sin token' });
    return result;
  };

  const refreshAdminData = () => {
    console.log('🔄 Refrescando datos de admin...');
    const savedAdmin = localStorage.getItem('adminData');
    const savedToken = localStorage.getItem('adminToken');
    
    if (savedAdmin && savedToken) {
      try {
        const adminData = JSON.parse(savedAdmin);
        setAdmin({ ...adminData, token: savedToken });
        console.log('✅ Datos de admin refrescados');
      } catch (error) {
        console.error('❌ Error refrescando admin:', error);
        logoutAdmin();
      }
    } else {
      console.log('ℹ️ No hay datos para refrescar');
      setAdmin(null);
    }
  };

  const value = {
    admin,
    loginAdmin,
    logoutAdmin,
    isAdmin,
    refreshAdminData,
    loading
  };

  // Debug: log del estado actual
  useEffect(() => {
    console.log('📊 Estado AdminContext:', {
      admin: admin ? {
        id: admin.id,
        email: admin.email,
        nombre: admin.nombre,
        hasToken: !!admin.token
      } : null,
      loading
    });
  }, [admin, loading]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;