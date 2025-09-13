const { Producto } = require('../models');

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      order: [['createdAt', 'DESC']] // Más recientes primero
    });
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ 
      error: 'Error al obtener productos',
      details: error.message 
    });
  }
};

// Obtener producto por ID
exports.obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ 
      error: 'Error al obtener producto',
      details: error.message 
    });
  }
};

// Crear nuevo producto
exports.crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, imagen, disponible } = req.body;
    
    // Validaciones básicas
    if (!nombre || !precio) {
      return res.status(400).json({ 
        error: 'Nombre y precio son campos obligatorios' 
      });
    }

    if (precio < 0) {
      return res.status(400).json({ 
        error: 'El precio no puede ser negativo' 
      });
    }
    
    const nuevoProducto = await Producto.create({
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      precio: parseFloat(precio),
      categoria: categoria ? categoria.trim() : null,
      imagen: imagen ? imagen.trim() : null,
      disponible: disponible !== undefined ? disponible : true
    });
    
    res.status(201).json({
      mensaje: 'Producto creado exitosamente',
      producto: nuevoProducto
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    
    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Error de validación',
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      error: 'Error al crear producto',
      details: error.message 
    });
  }
};

// Actualizar producto
exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria, imagen, disponible } = req.body;
    
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Validaciones básicas
    if (!nombre || !precio) {
      return res.status(400).json({ 
        error: 'Nombre y precio son campos obligatorios' 
      });
    }

    if (precio < 0) {
      return res.status(400).json({ 
        error: 'El precio no puede ser negativo' 
      });
    }
    
    await producto.update({
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      precio: parseFloat(precio),
      categoria: categoria ? categoria.trim() : null,
      imagen: imagen ? imagen.trim() : null,
      disponible: disponible !== undefined ? disponible : producto.disponible
    });
    
    res.json({
      mensaje: 'Producto actualizado exitosamente',
      producto: producto
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    
    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Error de validación',
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      error: 'Error al actualizar producto',
      details: error.message 
    });
  }
};

// Eliminar producto
exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Guardar el nombre para el mensaje de confirmación
    const nombreProducto = producto.nombre;
    
    await producto.destroy();
    
    res.json({ 
      mensaje: `Producto "${nombreProducto}" eliminado exitosamente`,
      id: parseInt(id)
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ 
      error: 'Error al eliminar producto',
      details: error.message 
    });
  }
};

// Cambiar disponibilidad del producto
exports.cambiarDisponibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { disponible } = req.body;
    
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    await producto.update({ disponible });
    
    res.json({
      mensaje: `Producto ${disponible ? 'habilitado' : 'deshabilitado'} exitosamente`,
      producto: producto
    });
  } catch (error) {
    console.error('Error al cambiar disponibilidad:', error);
    res.status(500).json({ 
      error: 'Error al cambiar disponibilidad',
      details: error.message 
    });
  }
};