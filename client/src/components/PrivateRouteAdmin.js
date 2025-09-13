import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

function PrivateRouteAdmin({ children }) {
  const { admin, loading } = useAdmin();

  console.log('🛡️ PrivateRouteAdmin - Estado:', { 
    admin: admin ? 'Presente' : 'No admin',
    loading,
    hasToken: !!localStorage.getItem('adminToken')
  });

  // Mostrar loading mientras verifica el estado
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  // Si no hay admin autenticado, redirigir al login
  if (!admin) {
    console.log('❌ PrivateRouteAdmin - No admin, redirigiendo a login');
    return <Navigate to="/admin/login" replace />;
  }

  // Verificar que el admin está activo
  if (admin.activo === false) {
    console.log('❌ PrivateRouteAdmin - Admin inactivo');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cuenta Desactivada</h2>
          <p className="text-gray-600 mb-6">Tu cuenta de administrador ha sido desactivada.</p>
          <button 
            onClick={() => window.location.href = '/admin/login'}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  console.log('✅ PrivateRouteAdmin - Admin autorizado:', {
    id: admin.id,
    email: admin.email,
    nombre: admin.nombre
  });

  // Si está todo bien, mostrar el componente
  return children;
}

export default PrivateRouteAdmin;