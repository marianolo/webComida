import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CarritoContext } from '../context/CarritoContext';
import { UsuarioContext } from '../context/UsuarioContext';

function Navbar() {
  const { carrito } = useContext(CarritoContext);
  const { usuario, logout } = useContext(UsuarioContext);
  const admin = JSON.parse(localStorage.getItem('admin'));
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    if (admin) {
      localStorage.removeItem('admin');
      navigate('/admin/login');
    } else {
      logout();
      navigate('/');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🍕</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">FoodApp</span>
            </Link>
          </div>

          {/* Links principales - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link flex items-center space-x-1">
              <span>🏠</span>
              <span>Inicio</span>
            </Link>
            
            {carrito.length > 0 && (
              <Link to="/pedido" className="nav-link flex items-center space-x-1 relative">
                <span>🛒</span>
                <span>Mi Pedido</span>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {carrito.length}
                </span>
              </Link>
            )}
          </div>

          {/* Usuario/Admin info - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {admin ? (
              <div className="flex items-center space-x-4">
                <Link to="/admin/panel" className="btn-primary flex items-center space-x-2">
                  <span>⚙️</span>
                  <span>Panel Admin</span>
                </Link>
                <button onClick={handleLogout} className="btn-secondary">
                  Salir
                </button>
              </div>
            ) : usuario ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {usuario.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">
                    Hola, {usuario.nombre}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn-secondary">
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn-secondary">
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="btn-primary">
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Botón hamburguesa - Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-orange-500 focus:outline-none focus:text-orange-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link 
                to="/" 
                className="nav-link block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Inicio
              </Link>
              
              {carrito.length > 0 && (
                <Link 
                  to="/pedido" 
                  className="nav-link block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🛒 Mi Pedido ({carrito.length})
                </Link>
              )}
              
              {admin ? (
                <>
                  <Link 
                    to="/admin/panel" 
                    className="nav-link block px-3 py-2 text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ⚙️ Panel Admin
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-800"
                  >
                    Salir
                  </button>
                </>
              ) : usuario ? (
                <>
                  <div className="px-3 py-2 text-base font-medium text-gray-700">
                    👋 Hola, {usuario.nombre}
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-800"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="nav-link block px-3 py-2 text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    to="/registro" 
                    className="nav-link block px-3 py-2 text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;