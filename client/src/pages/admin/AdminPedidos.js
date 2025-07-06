import React, { useEffect, useState } from 'react';
import { obtenerPedidos } from '../../services/api';

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerPedidos()
      .then(data => {
        // Asegurarse de que siempre sea un array
        setPedidos(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error al obtener pedidos:', error);
        setPedidos([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Pedidos Recibidos</h2>
        <p className="text-gray-600">Gestiona todos los pedidos de tus clientes</p>
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <span className="text-blue-800 font-medium">Total de pedidos: {(pedidos || []).length}</span>
        </div>
      </div>

      {(pedidos || []).length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-lg font-medium text-gray-600 mb-2">No hay pedidos aún</h3>
            <p className="text-gray-500">Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {(pedidos || []).map(p => (
            <div key={p.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              {/* Header del pedido */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Pedido #{p.id}
                  </h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Total: ${p.total}
                  </span>
                </div>
              </div>

              {/* Información del cliente */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                      Información del Cliente
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <span className="text-sm text-gray-500">Nombre:</span>
                          <p className="font-medium text-gray-800">{p.cliente_nombre}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div>
                          <span className="text-sm text-gray-500">Teléfono:</span>
                          <p className="font-medium text-gray-800">{p.cliente_telefono}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <span className="text-sm text-gray-500">Dirección:</span>
                          <p className="font-medium text-gray-800">{p.cliente_direccion}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Productos */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                      Productos Pedidos
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                      {p.productos && JSON.parse(p.productos).map((producto, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{producto.nombre}</p>
                            <p className="text-sm text-gray-500">Cantidad: {producto.cantidad}</p>
                          </div>
                          <span className="font-medium text-gray-800">
                            ${(producto.precio * producto.cantidad).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Observaciones */}
                {p.observaciones && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">
                      Observaciones
                    </h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-gray-800">{p.observaciones}</p>
                    </div>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Marcar como Completado
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Contactar Cliente
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPedidos;