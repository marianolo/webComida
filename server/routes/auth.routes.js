const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller');
const { verificarTokenAdmin, verificarToken, verificarTokenOpcional } = require('../Middleware/auth');

// Rutas públicas (no requieren autenticación)
router.post('/login', ctrl.login);
router.post('/registro', ctrl.registro);
router.post('/admin/login', ctrl.loginAdmin);

// Rutas protegidas - verificar token
router.get('/verificar', verificarTokenOpcional, ctrl.verificarToken);

// Rutas de administrador - requieren token de admin
router.post('/admin/crear', verificarTokenAdmin, ctrl.crearAdmin);

module.exports = router;