const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productos.controller');
const { verificarTokenAdmin, logActividadAdmin } = require('../Middleware/auth');

// Rutas públicas (para mostrar productos a usuarios)
router.get('/', ctrl.obtenerProductos);
router.get('/:id', ctrl.obtenerProductoPorId);

// Rutas de administración (protegidas con token de admin)
router.post('/', 
  verificarTokenAdmin, 
  logActividadAdmin('Crear producto'),
  ctrl.crearProducto
);

router.put('/:id', 
  verificarTokenAdmin, 
  logActividadAdmin('Actualizar producto'),
  ctrl.actualizarProducto
);

router.delete('/:id', 
  verificarTokenAdmin, 
  logActividadAdmin('Eliminar producto'),
  ctrl.eliminarProducto
);

router.put('/:id/disponibilidad', 
  verificarTokenAdmin, 
  logActividadAdmin('Cambiar disponibilidad'),
  ctrl.cambiarDisponibilidad
);

module.exports = router;