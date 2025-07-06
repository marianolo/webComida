const sequelize = require('../config/db');

const Producto = require('./Producto');
const Pedido = require('./Pedido');
const Usuario = require('./Usuario');
const Admin = require('./Admin');

const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('🟢 Base de datos sincronizada');
  } catch (error) {
    console.error('🔴 Error al sincronizar la base de datos:', error);
  }
};

module.exports = {
  sequelize,
  Producto,
  Pedido,
  Usuario,
  Admin,
  syncDB
};
