import React, { useEffect, useState } from 'react';
import { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } from '../../services/api';
import { Link } from 'react-router-dom';

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', imagen: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await obtenerProductos();
      setProductos(data);
    } catch (error) {
      setError('Error al cargar productos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async () => {
    if (!form.nombre || !form.precio) {
      setError('Nombre y precio son obligatorios');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await crearProducto(form);
      setForm({ nombre: '', descripcion: '', precio: '', imagen: '' });
      cargar();
    } catch (error) {
      setError('Error al crear producto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleActualizar = async () => {
    if (!form.nombre || !form.precio) {
      setError('Nombre y precio son obligatorios');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await actualizarProducto(editando, form);
      setEditando(null);
      setForm({ nombre: '', descripcion: '', precio: '', imagen: '' });
      cargar();
    } catch (error) {
      setError('Error al actualizar producto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        setLoading(true);
        await eliminarProducto(id);
        cargar();
      } catch (error) {
        setError('Error al eliminar producto');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditar = (producto) => {
    setEditando(producto.id);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      imagen: producto.imagen
    });
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setForm({ nombre: '', descripcion: '', precio: '', imagen: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link 
                to="/admin/panel" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span className="text-xl">←</span>
              </Link>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-xl">🛍️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
                <p className="text-sm text-gray-600">Administra el catálogo de tu restaurante</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{productos.length}</div>
              <div className="text-sm text-gray-600">Productos activos</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editando ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                placeholder="Ej: Pizza Margherita"
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio *
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={form.precio}
                onChange={e => setForm({ ...form, precio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                placeholder="Descripción del producto..."
                value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de la Imagen
              </label>
              <input
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={form.imagen}
                onChange={e => setForm({ ...form, imagen: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            {editando && (
              <button
                onClick={cancelarEdicion}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              onClick={editando ? handleActualizar : handleCrear}
              disabled={loading}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Guardando...' : (editando ? 'Actualizar' : 'Agregar Producto')}
            </button>
          </div>
        </div>

        {/* Lista de Productos */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Productos Actuales</h2>
          </div>
          
          {loading && productos.length === 0 ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          ) : productos.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
              <p className="text-gray-600">Agrega tu primer producto para comenzar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {productos.map(producto => (
                <div key={producto.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    {producto.imagen ? (
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
                        }}
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-4xl">🍽️</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 truncate">{producto.nombre}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{producto.descripcion}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-orange-600">${producto.precio}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditar(producto)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleEliminar(producto.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProductos;