const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cliente_nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cliente_telefono: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cliente_direccion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  productos: {
    type: DataTypes.TEXT, // Array de productos en JSON.stringify
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'preparando', 'entregado', 'cancelado'),
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'pedidos',
  timestamps: true,
  underscored: true
});

module.exports = Pedido;
