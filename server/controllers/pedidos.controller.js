const { Pedido } = require('../models');

exports.obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

exports.crearPedido = async (req, res) => {
  try {
    const nuevo = await Pedido.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear pedido' });
  }
};
