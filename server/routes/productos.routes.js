const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productos.controller');

router.get('/', ctrl.obtenerProductos);
router.post('/', ctrl.crearProducto);
router.put('/:id', ctrl.actualizarProducto); // ← AGREGAR ESTA LÍNEA
router.delete('/:id', ctrl.eliminarProducto);

module.exports = router;