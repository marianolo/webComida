const jwt = require('jsonwebtoken');
const { Admin, Usuario } = require('../models');

// Middleware para verificar token de usuario regular
const verificarToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acceso requerido',
        code: 'NO_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({ 
        error: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('Error en verificarToken:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado',
        code: 'EXPIRED_TOKEN'
      });
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Middleware para verificar token de administrador
const verificarTokenAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Token de administrador requerido',
        code: 'NO_ADMIN_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN || process.env.JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id);
    
    if (!admin) {
      return res.status(401).json({ 
        error: 'Administrador no encontrado',
        code: 'ADMIN_NOT_FOUND'
      });
    }

    if (!admin.activo) {
      return res.status(403).json({ 
        error: 'Cuenta de administrador desactivada',
        code: 'ADMIN_INACTIVE'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Error en verificarTokenAdmin:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token de administrador inválido',
        code: 'INVALID_ADMIN_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token de administrador expirado',
        code: 'EXPIRED_ADMIN_TOKEN'
      });
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Middleware opcional para verificar token (no falla si no hay token)
const verificarTokenOpcional = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      req.usuario = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id);
    
    req.usuario = usuario || null;
    next();
  } catch (error) {
    // Si hay error con el token, simplemente no autenticamos
    req.usuario = null;
    next();
  }
};

// Middleware para verificar roles específicos
const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario && !req.admin) {
      return res.status(401).json({ 
        error: 'Autenticación requerida',
        code: 'AUTH_REQUIRED'
      });
    }

    const usuario = req.usuario || req.admin;
    
    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({ 
        error: 'No tienes permisos para realizar esta acción',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

// Middleware para logging de actividad de admin
const logActividadAdmin = (accion) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log la actividad del admin después de la respuesta exitosa
      if (res.statusCode >= 200 && res.statusCode < 300 && req.admin) {
        console.log(`[ADMIN ACTIVITY] ${new Date().toISOString()} - Admin ${req.admin.email} realizó: ${accion} - IP: ${req.ip}`);
        
        // Aquí podrías guardar en una tabla de logs si quieres
        // LogActivity.create({
        //   adminId: req.admin.id,
        //   accion,
        //   ip: req.ip,
        //   userAgent: req.get('User-Agent')
        // });
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

module.exports = {
  verificarToken,
  verificarTokenAdmin,
  verificarTokenOpcional,
  verificarRol,
  logActividadAdmin
};