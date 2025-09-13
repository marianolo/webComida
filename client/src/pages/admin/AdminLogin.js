import React, { useState } from 'react';
import { loginAdmin } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginAdmin: contextLoginAdmin } = useAdmin(); // Usar la función del contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('🔐 Intentando login admin con:', { email: form.email });
    
    try {
      // Llamar a la API de login
      const response = await loginAdmin(form);
      console.log('✅ Respuesta del servidor admin:', response);
      
      // Verificar que tenemos los datos necesarios
      if (!response.token) {
        throw new Error('No se recibió token del servidor');
      }
      
      if (!response.admin) {
        throw new Error('No se recibieron datos del administrador');
      }
      
      // Usar la función del contexto para manejar el login
      contextLoginAdmin(response);
      
      console.log('✅ Login de admin completado, redirigiendo...');
      navigate('/admin/panel');
      
    } catch (error) {
      console.error('❌ Error completo:', error);
      
      // Manejar diferentes tipos de error
      if (error.response?.status === 401) {
        setError('Credenciales inválidas. Verifica tu email y contraseña.');
      } else if (error.response?.status === 403) {
        setError('Tu cuenta está desactivada. Contacta al administrador.');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Error al iniciar sesión: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-slate-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🔑</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Panel Administrativo
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Acceso exclusivo para administradores
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Administrativo
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="admin@foodapp.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                disabled={loading}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Tu contraseña administrativa"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex">
                <span className="text-red-400 mr-2">⚠️</span>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Botón de Submit */}
          <button
            type="submit"
            disabled={loading || !form.email.trim() || !form.password.trim()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Accediendo...
              </>
            ) : (
              'Acceder al Panel'
            )}
          </button>

          {/* Link de regreso */}
          <div className="text-center">
            <Link 
              to="/login" 
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center space-x-1"
            >
              <span>←</span>
              <span>Volver al login de clientes</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;