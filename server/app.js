const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/productos', require('./routes/productos.routes'));
app.use('/api/pedidos', require('./routes/pedidos.routes'));
app.use('/api/auth', require('./routes/auth.routes')); // ← SOLO ESTA LÍNEA PARA AUTH

module.exports = app;