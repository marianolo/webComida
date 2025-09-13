import React, { useEffect, useState } from 'react';
import { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } from '../../services/api';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ 
    nombre: '', 
    descripcion: '', 
    precio: '', 
    categoria: '',
    imagen: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editando, setEditando] = useState(null);
  const [eliminando, setEliminando] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  
  // Para manejar parámetros de URL
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { admin } = useAdmin();

  // Función de debug para mostrar información del estado
  const mostrarDebugInfo = () => {
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    
    const info = {
      // Estado del contexto
      adminContext: admin ? {
        id: admin.id,
        email: admin.email,
        nombre: admin.nombre,
        hasToken: !!admin.token,
        activo: admin.activo
      } : 'No admin',
      
      // Estado del localStorage
      localStorage: {
        adminToken: adminToken ? `${adminToken.substring(0, 30)}...` : 'No token',
        adminData: adminData ? JSON.parse(adminData) : 'No data',
      },
      
      // Estado de la aplicación
      app: {
        url: window.location.href,
        pathname: window.location.pathname,
        productosCount: productos.length,
        timestamp: new Date().toISOString()
      }
    };
    
    setDebugInfo(JSON.stringify(info, null, 2));
    console.log('🔍 Debug Info Completa:', info);
  };

  useEffect(() => {
    console.log('🔍 AdminProductos - useEffect iniciando...');
    console.log('🔍 Estado AdminContext:', { 
      admin: admin ? { id: admin.id, email: admin.email, hasToken: !!admin.token } : null 
    });
    console.log('🔍 localStorage:', {
      adminToken: localStorage.getItem('adminToken') ? 'Presente' : 'Ausente',
      adminData: localStorage.getItem('adminData') ? 'Presente' : 'Ausente'
    });
    
    cargar();
    mostrarDebugInfo();
  }, [admin]);

  // Efecto separado para manejar el parámetro de edición
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && productos.length > 0) {
      console.log('📝 Parámetro edit detectado:', editId);
      const producto = productos.find(p => p.id === parseInt(editId));
      if (producto) {
        console.log('✅ Producto encontrado para edición:', producto.nombre);
        handleEditar(producto);
        // Limpiar el parámetro de la URL pero mantener el estado
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('edit');
        setSearchParams(newParams, { replace: true });
        
        // Scroll suave al formulario
        setTimeout(() => {
          const formulario = document.getElementById('formulario-producto');
          if (formulario) {
            formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        console.warn('⚠️ Producto no encontrado para ID:', editId);
        setError(`No se encontró el producto con ID ${editId}`);
      }
    }
  }, [productos, searchParams]);

  const cargar = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('📥 Cargando productos...');
      const data = await obtenerProductos();
      setProductos(data);
      console.log('✅ Productos cargados:', data.length);
    } catch (error) {
      const errorMsg = 'Error al cargar productos: ' + error.message;
      setError(errorMsg);
      console.error('❌', errorMsg, error);
    } finally {
      setLoading(false);
    }
  };

  const limpiarMensajes = () => {
    setError('');
    setSuccess('');
  };

  const limpiarFormulario = () => {
    setForm({ nombre: '', descripcion: '', precio: '', categoria: '', imagen: '' });
    setEditando(null);
    limpiarMensajes();
  };

  const validarFormulario = () => {
    if (!form.nombre.trim()) {
      setError('El nombre del producto es obligatorio');
      return false;
    }
    
    if (!form.precio || parseFloat(form.precio) <= 0) {
      setError('El precio debe ser mayor a 0');
      return false;
    }

    return true;
  };

  const handleCrear = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      limpiarMensajes();
      
      console.log('🛠️ Creando producto...', form);
      
      // Verificar que tenemos admin autenticado
      if (!admin || !admin.token) {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
          setError('No hay token de administrador. Por favor, vuelve a iniciar sesión.');
          setTimeout(() => window.location.href = '/admin/login', 2000);
          return;
        }
      }
      
      const nuevoProducto = await crearProducto(form);
      setSuccess('Producto creado exitosamente');
      limpiarFormulario();
      await cargar(); // Esperar a que se recargue la lista
    } catch (error) {
      console.error('❌ Error al crear producto:', error);
      
      if (error.response?.status === 401 || error.message.includes('401') || error.message.includes('Token')) {
        setError('Error de autenticación. Redirigiendo al login...');
        setTimeout(() => window.location.href = '/admin/login', 2000);
      } else {
        setError('Error al crear producto: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleActualizar = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      limpiarMensajes();
      
      console.log('🔄 Actualizando producto...', editando, form);
      
      // Verificar que tenemos admin autenticado
      if (!admin || !admin.token) {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
          setError('No hay token de administrador. Por favor, vuelve a iniciar sesión.');
          setTimeout(() => window.location.href = '/admin/login', 2000);
          return;
        }
      }
      
      await actualizarProducto(editando, form);
      setSuccess('Producto actualizado exitosamente');
      limpiarFormulario();
      await cargar(); // Esperar a que se recargue la lista
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error);
      
      if (error.response?.status === 401 || error.message.includes('401') || error.message.includes('Token')) {
        setError('Error de autenticación. Redirigiendo al login...');
        setTimeout(() => window.location.href = '/admin/login', 2000);
      } else {
        setError('Error al actualizar producto: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    // Mostrar modal de confirmación personalizado
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar el producto "${nombre}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmar) return;

    try {
      setEliminando(id);
      limpiarMensajes();
      
      // Verificar que tenemos admin autenticado
      if (!admin || !admin.token) {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
          setError('No hay token de administrador. Por favor, vuelve a iniciar sesión.');
          setTimeout(() => window.location.href = '/admin/login', 2000);
          return;
        }
      }
      
      const resultado = await eliminarProducto(id);
      setSuccess(resultado.mensaje || 'Producto eliminado exitosamente');
      
      // Remover el producto de la lista local para mejor UX
      setProductos(productos.filter(p => p.id !== id));
      
    } catch (error) {
      console.error('❌ Error al eliminar producto:', error);
      
      if (error.response?.status === 401 || error.message.includes('401') || error.message.includes('Token')) {
        setError('Error de autenticación. Redirigiendo al login...');
        setTimeout(() => window.location.href = '/admin/login', 2000);
      } else {
        setError('Error al eliminar producto: ' + error.message);
      }
    } finally {
      setEliminando(null);
    }
  };

  const handleEditar = (producto) => {
    console.log('📝 Iniciando edición del producto:', producto.nombre);
    setEditando(producto.id);
    setForm({
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      precio: producto.precio || '',
      categoria: producto.categoria || '',
      imagen: producto.imagen || ''
    });
    limpiarMensajes();
  };

  const cancelarEdicion = () => {
    limpiarFormulario();
    // Si llegamos desde el home con un parámetro edit, regresar al home
    const editId = searchParams.get('edit');
    if (editId) {
      navigate('/');
    }
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(precio);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
                title="Volver al inicio"
              >
                <span className="text-xl">←</span>
              </Link>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-xl">🛍️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
                <p className="text-sm text-gray-600">
                  Administra el catálogo de tu restaurante
                  {admin && <span className="ml-2">• Logueado como: {admin.nombre || admin.email || 'Admin'}</span>}
                  {editando && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Editando producto #{editando}
                    </span>
                  )}
                </p>
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

        {/* Mensajes de estado */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-600 mr-2">⚠️</span>
              <p className="text-sm text-red-600 flex-1">{error}</p>
              <button 
                onClick={limpiarMensajes}
                className="ml-auto text-red-400 hover:text-red-600 text-lg"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-green-600 mr-2">✅</span>
              <p className="text-sm text-green-600 flex-1">{success}</p>
              <button 
                onClick={limpiarMensajes}
                className="ml-auto text-green-400 hover:text-green-600 text-lg"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div id="formulario-producto" className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editando ? (
                <span className="flex items-center space-x-2">
                  <span>✏️ Editando:</span>
                  <span className="text-orange-600">{form.nombre || 'Producto'}</span>
                </span>
              ) : (
                '➕ Agregar Nuevo Producto'
              )}
            </h2>
            
            {editando && (
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  ID: {editando}
                </span>
                <button
                  onClick={() => {
                    const producto = productos.find(p => p.id === editando);
                    if (producto) {
                      window.open(`/?preview=${producto.id}`, '_blank');
                    }
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
                  title="Vista previa en el catálogo"
                >
                  👁️ Vista previa
                </button>
              </div>
            )}
          </div>

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
                maxLength={100}
                disabled={loading}
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
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <input
                type="text"
                placeholder="Ej: Pizza, Hamburguesas, Bebidas"
                value={form.categoria}
                onChange={e => setForm({ ...form, categoria: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                maxLength={50}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de la Imagen
              </label>
              <input
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={form.imagen}
                onChange={e => setForm({ ...form, imagen: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
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
                maxLength={500}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            {editando && (
              <button
                onClick={cancelarEdicion}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
            )}
            <button
              onClick={editando ? handleActualizar : handleCrear}
              disabled={loading || !form.nombre.trim() || !form.precio}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              ) : (
                editando ? '💾 Actualizar Producto' : '➕ Agregar Producto'
              )}
            </button>
          </div>
        </div>

        {/* Lista de Productos */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Productos Actuales</h2>
              <button
                onClick={cargar}
                disabled={loading}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                🔄 Actualizar
              </button>
            </div>
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
                <div 
                  key={producto.id} 
                  className={`bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all relative ${
                    editando === producto.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                >
                  {/* Indicador de edición */}
                  {editando === producto.id && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      ✏️ Editando
                    </div>
                  )}
                  
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
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 truncate flex-1">{producto.nombre}</h3>
                      {producto.categoria && (
                        <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          {producto.categoria}
                        </span>
                      )}
                    </div>
                    
                    {producto.descripcion && (
                      <p className="text-sm text-gray-600 line-clamp-2">{producto.descripcion}</p>
                    )}
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-orange-600">
                        {formatearPrecio(producto.precio)}
                      </span>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditar(producto)}
                          disabled={loading}
                          className={`px-3 py-1 text-white text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            editando === producto.id 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                          title={editando === producto.id ? 'Editando este producto' : 'Editar producto'}
                        >
                          {editando === producto.id ? '✅' : '✏️'}
                        </button>
                        <button
                          onClick={() => handleEliminar(producto.id, producto.nombre)}
                          disabled={loading || eliminando === producto.id}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar producto"
                        >
                          {eliminando === producto.id ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            '🗑️'
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* Estado de disponibilidad */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        ID: {producto.id}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        producto.disponible !== false
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {producto.disponible !== false ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información adicional */}
        {productos.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{productos.length}</div>
                <div className="text-sm text-blue-800">Total de productos</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {productos.filter(p => p.disponible !== false).length}
                </div>
                <div className="text-sm text-green-800">Productos disponibles</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {formatearPrecio(
                    productos.reduce((acc, p) => acc + parseFloat(p.precio), 0) / productos.length || 0
                  )}
                </div>
                <div className="text-sm text-orange-800">Precio promedio</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProductos;