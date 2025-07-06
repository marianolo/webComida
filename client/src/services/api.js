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
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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
    // Devolver datos de ejemplo si no hay backend
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
      },
      {
        id: 4,
        nombre: 'Ensalada César',
        descripcion: 'Ensalada fresca con pollo, crutones y aderezo césar',
        precio: 8.99,
        categoria: 'Ensaladas',
        imagen: null,
        disponible: true
      },
      {
        id: 5,
        nombre: 'Tacos Mexicanos',
        descripcion: 'Auténticos tacos con carne asada, cebolla y cilantro',
        precio: 7.99,
        categoria: 'Mexicana',
        imagen: null,
        disponible: true
      },
      {
        id: 6,
        nombre: 'Sushi Roll',
        descripcion: 'Delicioso roll de salmón con aguacate y pepino',
        precio: 14.99,
        categoria: 'Sushi',
        imagen: null,
        disponible: true
      }
    ];
  }
};

export const crearProducto = async (producto) => {
  try {
    const response = await api.post('/productos', producto);
    return response.data;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

export const actualizarProducto = async (id, producto) => {
  try {
    const response = await api.put(`/productos/${id}`, producto);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

export const eliminarProducto = async (id) => {
  try {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
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
    const response = await api.post('/auth/admin/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión como admin:', error);
    throw error;
  }
};

export default api;