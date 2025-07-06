const { Producto } = require('../models');

exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ 
      error: 'Error al obtener productos',
      details: error.message 
    });
  }
};

exports.crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, imagen, disponible } = req.body;
    
    const nuevo = await Producto.create({
      nombre,
      descripcion,
      precio,
      categoria,
      imagen,
      disponible: disponible !== undefined ? disponible : true
    });
    
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ 
      error: 'Error al crear producto',
      details: error.message 
    });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria, imagen, disponible } = req.body;
    
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    await producto.update({
      nombre,
      descripcion,
      precio,
      categoria,
      imagen,
      disponible
    });
    
    res.json(producto);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ 
      error: 'Error al actualizar producto',
      details: error.message 
    });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    await Producto.destroy({ where: { id } });
    res.json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ 
      error: 'Error al eliminar producto',
      details: error.message 
    });
  }
};