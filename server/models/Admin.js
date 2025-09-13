const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('super_admin', 'admin', 'moderador'),
    defaultValue: 'admin'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  ultimo_acceso: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'admins',
  timestamps: true,
  underscored: true
});

// Método para verificar contraseña
Admin.prototype.verificarPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error('Error al verificar contraseña:', error);
    return false;
  }
};

// Método para actualizar último acceso
Admin.prototype.actualizarAcceso = async function() {
  try {
    this.ultimo_acceso = new Date();
    await this.save();
  } catch (error) {
    console.error('Error al actualizar acceso:', error);
  }
};

// Método para devolver datos seguros (sin password)
Admin.prototype.toSafeJSON = function() {
  const admin = this.toJSON();
  delete admin.password;
  return admin;
};

// Hook para hashear password antes de crear
Admin.beforeCreate(async (admin) => {
  if (admin.password) {
    try {
      admin.password = await bcrypt.hash(admin.password, 12);
    } catch (error) {
      console.error('Error al hashear password:', error);
      throw error;
    }
  }
});

// Hook para hashear password antes de actualizar (si se cambia)
Admin.beforeUpdate(async (admin) => {
  if (admin.changed('password')) {
    try {
      admin.password = await bcrypt.hash(admin.password, 12);
    } catch (error) {
      console.error('Error al hashear password:', error);
      throw error;
    }
  }
});

module.exports = Admin;