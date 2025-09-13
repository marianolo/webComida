const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
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
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rol: {
    type: DataTypes.ENUM('cliente', 'usuario'),
    defaultValue: 'cliente'
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
  tableName: 'usuarios',
  timestamps: true,
  underscored: true
});

// Método para verificar contraseña
Usuario.prototype.verificarPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error('Error al verificar contraseña:', error);
    return false;
  }
};

// Método para actualizar último acceso
Usuario.prototype.actualizarAcceso = async function() {
  try {
    this.ultimo_acceso = new Date();
    await this.save();
  } catch (error) {
    console.error('Error al actualizar acceso:', error);
  }
};

// Método para devolver datos seguros (sin password)
Usuario.prototype.toSafeJSON = function() {
  const usuario = this.toJSON();
  delete usuario.password;
  return usuario;
};

// Hook para hashear password antes de crear
Usuario.beforeCreate(async (usuario) => {
  if (usuario.password) {
    try {
      usuario.password = await bcrypt.hash(usuario.password, 12);
    } catch (error) {
      console.error('Error al hashear password:', error);
      throw error;
    }
  }
});

// Hook para hashear password antes de actualizar (si se cambia)
Usuario.beforeUpdate(async (usuario) => {
  if (usuario.changed('password')) {
    try {
      usuario.password = await bcrypt.hash(usuario.password, 12);
    } catch (error) {
      console.error('Error al hashear password:', error);
      throw error;
    }
  }
});

module.exports = Usuario;