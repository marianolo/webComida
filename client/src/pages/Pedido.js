import React, { useContext, useState, useEffect } from 'react';
import { CarritoContext } from '../context/CarritoContext';
import { UsuarioContext } from '../context/UsuarioContext';
import { crearPedido } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Pedido() {
  const { carrito, vaciarCarrito } = useContext(CarritoContext);
  const { usuario } = useContext(UsuarioContext);
  const [cliente, setCliente] = useState({
    nombre: '', telefono: '', direccion: '', observaciones: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario) {
      setCliente({
        nombre: usuario.nombre,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        observaciones: ''
      });
    }
  }, [usuario]);

  const handlePedido = async () => {
    const pedido = {
      ...cliente,
      productos: JSON.stringify(carrito),
      total: carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
      usuarioId: usuario?.id || null
    };

    await crearPedido(pedido);
    vaciarCarrito();
    alert('Pedido enviado');
    navigate('/');
  };

  return (
    <div>
      <h2>Confirmar Pedido</h2>
      <input value={cliente.nombre} onChange={e => setCliente({ ...cliente, nombre: e.target.value })} />
      <input value={cliente.telefono} onChange={e => setCliente({ ...cliente, telefono: e.target.value })} />
      <input value={cliente.direccion} onChange={e => setCliente({ ...cliente, direccion: e.target.value })} />
      <textarea placeholder="Observaciones" onChange={e => setCliente({ ...cliente, observaciones: e.target.value })} />

      <button onClick={handlePedido}>Enviar</button>
    </div>
  );
}

export default Pedido;
