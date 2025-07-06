const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Rutas de autenticación
router.post('/login', authController.login);
router.post('/registro', authController.registro);
router.post('/admin/login', authController.loginAdmin);

module.exports = router;