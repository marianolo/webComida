import React, { useEffect, useState, useContext } from 'react';
import { obtenerProductos } from '../services/api';
import { CarritoContext } from '../context/CarritoContext';
import { toast } from 'react-toastify';

function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { agregarAlCarrito } = useContext(CarritoContext);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const productosData = await obtenerProductos();
        setProductos(productosData);
        setLoading(false);
      } catch (error) {
        toast.error('Error al cargar productos');
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  const handleAgregarAlCarrito = (producto) => {
    agregarAlCarrito(producto);
    toast.success(`${producto.nombre} agregado al carrito! 🛒`);
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || producto.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtener categorías únicas
  const categorias = [...new Set(productos.map(p => p.categoria))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 md:p-12 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg">
            Deliciosa comida a domicilio
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-shadow">
            Los mejores sabores llegan directamente a tu puerta
          </p>
          <div className="flex flex-wrap gap-4 text-lg">
            <div className="flex items-center space-x-2">
              <span>🚚</span>
              <span>Entrega rápida</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>⭐</span>
              <span>Calidad garantizada</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>💳</span>
              <span>Pago seguro</span>
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-4 right-4 text-6xl opacity-20">🍕</div>
        <div className="absolute bottom-4 right-8 text-4xl opacity-20">🍔</div>
        <div className="absolute top-1/2 right-12 text-5xl opacity-20">🍟</div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === 'all' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos
            </button>
            {categorias.map(categoria => (
              <button
                key={categoria}
                onClick={() => setSelectedCategory(categoria)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === categoria 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catálogo de productos */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Nuestro Menú</h2>
        
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-500">
              Intenta ajustar tu búsqueda o filtros
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map((producto, index) => (
              <div 
                key={producto.id} 
                className={`card-product animate-fade-in-up animation-delay-${index % 3 * 200}`}
              >
                {/* Imagen del producto */}
                <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  {producto.imagen ? (
                    <img 
                      src={producto.imagen} 
                      alt={producto.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl">🍽️</div>
                  )}
                  
                  {/* Badge de categoría */}
                  <div className="absolute top-3 left-3 bg-white bg-opacity-90 text-xs font-semibold px-2 py-1 rounded-full">
                    {producto.categoria}
                  </div>
                </div>

                {/* Contenido de la card */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {producto.nombre}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                    {producto.descripcion}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-orange-500">
                        ${producto.precio}
                      </span>
                      {producto.precio_original && (
                        <span className="text-sm text-gray-500 line-through">
                          ${producto.precio_original}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleAgregarAlCarrito(producto)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <span>🛒</span>
                      <span>Agregar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de información adicional */}
      <div className="bg-white rounded-xl p-8 shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          ¿Por qué elegirnos?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h4 className="text-xl font-semibold mb-2">Entrega Rápida</h4>
            <p className="text-gray-600">
              Entregamos tu comida en menos de 30 minutos
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">👨‍🍳</div>
            <h4 className="text-xl font-semibold mb-2">Chefs Expertos</h4>
            <p className="text-gray-600">
              Preparamos cada plato con ingredientes frescos
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h4 className="text-xl font-semibold mb-2">Calidad Garantizada</h4>
            <p className="text-gray-600">
              Satisfacción 100% garantizada en cada pedido
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;