import axios from 'axios';

// Configura la URL base de tu API
const API_URL = 'http://localhost:8000/api'; 

// Configuración de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  (config) => {
    // Primero intentar obtener el token de admin, después el de usuario regular
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token');
    
    // Dar prioridad al token de admin si existe
    const token = adminToken || userToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug: log para ver qué token se está enviando
    console.log('🔑 Token enviado:', token ? `${token.substring(0, 20)}...` : 'No token');
    console.log('🎯 Request to:', config.url);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => {
    // Debug: log de respuestas exitosas
    console.log('✅ Respuesta exitosa:', response.config.url, response.status);
    return response;
  },
  (error) => {
    // Debug: log detallado de errores
    console.error('❌ Error en API:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.config?.headers
    });

    if (error.response?.status === 401) {
      const errorData = error.response.data;
      
      // Verificar si es un error de token de admin específicamente
      if (errorData?.code === 'NO_ADMIN_TOKEN' || 
          errorData?.code === 'INVALID_ADMIN_TOKEN' || 
          errorData?.code === 'EXPIRED_ADMIN_TOKEN' ||
          errorData?.code === 'ADMIN_NOT_FOUND' ||
          errorData?.code === 'ADMIN_INACTIVE') {
        
        console.warn('🚫 Error de autenticación de admin:', errorData);
        
        // Limpiar tokens de admin
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        
        // Solo redirigir si estamos en una ruta de admin
        if (window.location.pathname.startsWith('/admin') && 
            window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      } else {
        // Error de token de usuario regular
        console.warn('🚫 Error de autenticación de usuario:', errorData);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        
        // Solo redirigir si NO estamos en rutas de admin
        if (!window.location.pathname.startsWith('/admin')) {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Servicios para productos
export const obtenerProductos = async () => {
  try {
    const response = await api.get('/productos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    
    // Si el servidor no está disponible, devolver datos de ejemplo
    if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
      console.warn('Servidor no disponible, usando datos de ejemplo');
      return [
        {
          id: 1,
          nombre: 'Pizza Margherita',
          descripcion: 'Deliciosa pizza con tomate, mozzarella y albahaca fresca',
          precio: 12.99,
          categoria: 'Pizza',
          imagen: null,
          disponible: true
        },
        {
          id: 2,
          nombre: 'Hamburguesa Clásica',
          descripcion: 'Jugosa hamburguesa con carne, lechuga, tomate y papas',
          precio: 9.99,
          categoria: 'Hamburguesas',
          imagen: null,
          disponible: true
        },
        {
          id: 3,
          nombre: 'Pasta Carbonara',
          descripcion: 'Pasta cremosa con bacon, huevo y queso parmesano',
          precio: 11.50,
          categoria: 'Pasta',
          imagen: null,
          disponible: true
        }
      ];
    }
    
    throw error;
  }
};

export const obtenerProductoPorId = async (id) => {
  try {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener producto:', error);
    throw error;
  }
};

export const crearProducto = async (producto) => {
  try {
    // Debug: verificar token antes de enviar
    const adminToken = localStorage.getItem('adminToken');
    console.log('🔧 Creando producto con token:', adminToken ? 'Token presente' : 'No token');
    
    // Validaciones del lado del cliente
    if (!producto.nombre || !producto.precio) {
      throw new Error('Nombre y precio son obligatorios');
    }

    if (parseFloat(producto.precio) < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    // Limpiar datos antes de enviar
    const productoLimpio = {
      nombre: producto.nombre.trim(),
      descripcion: producto.descripcion ? producto.descripcion.trim() : '',
      precio: parseFloat(producto.precio),
      categoria: producto.categoria ? producto.categoria.trim() : '',
      imagen: producto.imagen ? producto.imagen.trim() : '',
      disponible: producto.disponible !== undefined ? producto.disponible : true
    };

    console.log('📦 Enviando producto:', productoLimpio);
    const response = await api.post('/productos', productoLimpio);
    console.log('✅ Producto creado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear producto:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Manejar errores específicos del servidor
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    throw error;
  }
};

export const actualizarProducto = async (id, producto) => {
  try {
    // Debug: verificar token antes de enviar
    const adminToken = localStorage.getItem('adminToken');
    console.log('🔧 Actualizando producto con token:', adminToken ? 'Token presente' : 'No token');
    
    // Validaciones del lado del cliente
    if (!producto.nombre || !producto.precio) {
      throw new Error('Nombre y precio son obligatorios');
    }

    if (parseFloat(producto.precio) < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    // Limpiar datos antes de enviar
    const productoLimpio = {
      nombre: producto.nombre.trim(),
      descripcion: producto.descripcion ? producto.descripcion.trim() : '',
      precio: parseFloat(producto.precio),
      categoria: producto.categoria ? producto.categoria.trim() : '',
      imagen: producto.imagen ? producto.imagen.trim() : '',
      disponible: producto.disponible !== undefined ? producto.disponible : true
    };

    console.log('📦 Actualizando producto ID:', id, productoLimpio);
    const response = await api.put(`/productos/${id}`, productoLimpio);
    console.log('✅ Producto actualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar producto:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Manejar errores específicos del servidor
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    throw error;
  }
};

export const eliminarProducto = async (id) => {
  try {
    console.log('🗑️ Eliminando producto ID:', id);
    const response = await api.delete(`/productos/${id}`);
    console.log('✅ Producto eliminado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    
    // Manejar errores específicos del servidor
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    throw error;
  }
};

export const cambiarDisponibilidad = async (id, disponible) => {
  try {
    const response = await api.put(`/productos/${id}/disponibilidad`, { disponible });
    return response.data;
  } catch (error) {
    console.error('Error al cambiar disponibilidad:', error);
    throw error;
  }
};

// Servicios para pedidos
export const obtenerPedidos = async () => {
  try {
    const response = await api.get('/pedidos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    // Devolver datos de ejemplo si no hay backend
    return [
      {
        id: 1,
        usuario: 'Juan Pérez',
        productos: [
          { nombre: 'Pizza Margherita', cantidad: 2, precio: 12.99 },
          { nombre: 'Coca Cola', cantidad: 1, precio: 2.50 }
        ],
        total: 28.48,
        estado: 'Pendiente',
        fecha: new Date().toISOString(),
        direccion: 'Calle Falsa 123'
      },
      {
        id: 2,
        usuario: 'María García',
        productos: [
          { nombre: 'Hamburguesa Clásica', cantidad: 1, precio: 9.99 }
        ],
        total: 9.99,
        estado: 'En preparación',
        fecha: new Date().toISOString(),
        direccion: 'Av. Principal 456'
      }
    ];
  }
};

export const crearPedido = async (pedido) => {
  try {
    const response = await api.post('/pedidos', pedido);
    return response.data;
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw error;
  }
};

export const actualizarEstadoPedido = async (id, estado) => {
  try {
    const response = await api.put(`/pedidos/${id}/estado`, { estado });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    throw error;
  }
};

// Servicios para autenticación
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

export const registro = async (userData) => {
  try {
    const response = await api.post('/auth/registro', userData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

export const loginAdmin = async (credentials) => {
  try {
    console.log('🔐 Intentando login de admin...');
    const response = await api.post('/auth/admin/login', credentials);
    console.log('✅ Login de admin exitoso');
    return response.data;
  } catch (error) {
    console.error('❌ Error al iniciar sesión como admin:', error);
    throw error;
  }
};

// Función helper para debug - puedes llamarla desde la consola
window.debugAPI = {
  checkTokens: () => {
    console.log('🔍 Debug de tokens:');
    console.log('Admin token:', localStorage.getItem('adminToken'));
    console.log('User token:', localStorage.getItem('token'));
    console.log('Admin data:', localStorage.getItem('adminData'));
  },
  clearTokens: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    console.log('🧹 Tokens limpiados');
  }
};

export default api;