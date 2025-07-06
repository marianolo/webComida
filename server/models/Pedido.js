const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pedido = sequelize.define('Pedido', {
  cliente_nombre: DataTypes.STRING,
  cliente_telefono: DataTypes.STRING,
  cliente_direccion: DataTypes.STRING,
  observaciones: DataTypes.TEXT,
  productos: DataTypes.TEXT, // guardamos array JSON stringificado
  total: DataTypes.DECIMAL(10, 2)
});

module.exports = Pedido;