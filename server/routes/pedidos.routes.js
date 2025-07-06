const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pedidos.controller');

router.get('/', ctrl.obtenerPedidos);
router.post('/', ctrl.crearPedido);

module.exports = router;
