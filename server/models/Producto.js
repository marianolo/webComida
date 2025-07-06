const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./Usuario');

const Pedido = sequelize.define('Pedido', {
  cliente_nombre: DataTypes.STRING,
  cliente_telefono: DataTypes.STRING,
  cliente_direccion: DataTypes.STRING,
  observaciones: DataTypes.TEXT,
  productos: DataTypes.TEXT, // JSON.stringify del carrito
  total: DataTypes.DECIMAL(10, 2),
});

Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId' });

module.exports = Pedido;
