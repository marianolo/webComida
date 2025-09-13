import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AdminPanel() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('admin');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                <span className="text-xl">🔑</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
                <p className="text-sm text-gray-600">Sistema de gestión FoodApp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido, Administrador!</h2>
            <p className="text-gray-600 text-lg">Gestiona tu aplicación de delivery desde aquí</p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Productos Card */}
          <Link
            to="/admin/productos"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🛍️</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">Productos</div>
                  <div className="text-sm text-gray-600">Gestionar catálogo</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  Administrar Productos
                </h3>
                <p className="text-gray-600">
                  Crear, editar y eliminar productos del menú. Gestiona precios, descripciones e imágenes.
                </p>
              </div>
              <div className="mt-4 flex items-center text-orange-600 font-medium group-hover:text-orange-700">
                <span>Ir a Productos</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Pedidos Card */}
          <Link
            to="/admin/pedidos"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📦</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">Pedidos</div>
                  <div className="text-sm text-gray-600">Gestionar órdenes</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Administrar Pedidos
                </h3>
                <p className="text-gray-600">
                  Revisa y gestiona todos los pedidos realizados por los clientes. Controla el estado de entrega.
                </p>
              </div>
              <div className="mt-4 flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                <span>Ir a Pedidos</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Categorías Card */}
          <Link
            to="/admin/categorias"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📁</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">Categorías</div>
                  <div className="text-sm text-gray-600">Organizar productos</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                  Administrar Categorías
                </h3>
                <p className="text-gray-600">
                  Crear, editar y organizar las categorías del menú. Mantén tu catálogo bien estructurado.
                </p>
              </div>
              <div className="mt-4 flex items-center text-green-600 font-medium group-hover:text-green-700">
                <span>Ir a Categorías</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Estadísticas Card */}
          <Link
            to="/admin/estadisticas"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">Estadísticas</div>
                  <div className="text-sm text-gray-600">Análisis y reportes</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  Ver Estadísticas
                </h3>
                <p className="text-gray-600">
                  Analiza las ventas, productos más vendidos y métricas importantes de tu negocio.
                </p>
              </div>
              <div className="mt-4 flex items-center text-purple-600 font-medium group-hover:text-purple-700">
                <span>Ir a Estadísticas</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;