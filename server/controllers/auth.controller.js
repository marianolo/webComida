const jwt = require('jsonwebtoken');
const { Admin, Usuario } = require('../models');

// Generar token JWT
const generarToken = (payload, esAdmin = false) => {
  const secret = esAdmin ? 
    (process.env.JWT_SECRET_ADMIN || process.env.JWT_SECRET) : 
    process.env.JWT_SECRET;
    
  return jwt.sign(payload, secret, { 
    expiresIn: esAdmin ? '24h' : '7d' // Admin tokens duran menos
  });
};

// Login de administrador
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son obligatorios' 
      });
    }

    // Buscar admin por email
    const admin = await Admin.findOne({ where: { email: email.toLowerCase() } });
    
    if (!admin) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Verificar si está activo
    if (!admin.activo) {
      return res.status(403).json({ 
        error: 'Cuenta desactivada. Contacta al administrador.',
        code: 'ACCOUNT_DISABLED'
      });
    }

    // Verificar contraseña
    const passwordValido = await admin.verificarPassword(password);
    
    if (!passwordValido) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Actualizar último acceso
    await admin.actualizarAcceso();

    // Generar token
    const token = generarToken({ 
      id: admin.id, 
      email: admin.email, 
      rol: admin.rol 
    }, true);

    res.json({
      mensaje: 'Login exitoso',
      token,
      admin: admin.toSafeJSON()
    });

  } catch (error) {
    console.error('Error en loginAdmin:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Login de usuario regular
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son obligatorios' 
      });
    }

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email: email.toLowerCase() } });
    
    if (!usuario) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Verificar si está activo
    if (!usuario.activo) {
      return res.status(403).json({ 
        error: 'Cuenta desactivada. Contacta al soporte.',
        code: 'ACCOUNT_DISABLED'
      });
    }

    // Verificar contraseña
    const passwordValido = await usuario.verificarPassword(password);
    
    if (!passwordValido) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Actualizar último acceso
    await usuario.actualizarAcceso();

    // Generar token
    const token = generarToken({ 
      id: usuario.id, 
      email: usuario.email, 
      rol: usuario.rol 
    });

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: usuario.toSafeJSON()
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Registro de usuario
exports.registro = async (req, res) => {
  try {
    const { nombre, email, password, telefono, direccion } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        error: 'Nombre, email y contraseña son obligatorios' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ 
      where: { email: email.toLowerCase() } 
    });
    
    if (usuarioExistente) {
      return res.status(409).json({ 
        error: 'Ya existe un usuario con este email',
        code: 'EMAIL_EXISTS'
      });
    }

    // Crear nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre: nombre.trim(),
      email: email.toLowerCase().trim(),
      password,
      telefono: telefono?.trim(),
      direccion: direccion?.trim()
    });

    // Generar token
    const token = generarToken({ 
      id: nuevoUsuario.id, 
      email: nuevoUsuario.email, 
      rol: nuevoUsuario.rol 
    });

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: nuevoUsuario.toSafeJSON()
    });

  } catch (error) {
    console.error('Error en registro:', error);
    
    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Error de validación',
        details: error.errors.map(e => e.message)
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ 
        error: 'Ya existe un usuario con este email',
        code: 'EMAIL_EXISTS'
      });
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Crear administrador (solo para super_admin)
exports.crearAdmin = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar que quien hace la petición es super_admin
    if (req.admin.rol !== 'super_admin') {
      return res.status(403).json({ 
        error: 'Solo los super administradores pueden crear administradores',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    // Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        error: 'Nombre, email y contraseña son obligatorios' 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        error: 'La contraseña de administrador debe tener al menos 8 caracteres' 
      });
    }

    // Verificar si el email ya existe
    const adminExistente = await Admin.findOne({ 
      where: { email: email.toLowerCase() } 
    });
    
    if (adminExistente) {
      return res.status(409).json({ 
        error: 'Ya existe un administrador con este email',
        code: 'EMAIL_EXISTS'
      });
    }

    // Crear nuevo admin
    const nuevoAdmin = await Admin.create({
      nombre: nombre.trim(),
      email: email.toLowerCase().trim(),
      password,
      rol: rol || 'admin'
    });

    res.status(201).json({
      mensaje: 'Administrador creado exitosamente',
      admin: nuevoAdmin.toSafeJSON()
    });

  } catch (error) {
    console.error('Error en crearAdmin:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Error de validación',
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Verificar token (para mantener sesión)
exports.verificarToken = async (req, res) => {
  try {
    // El middleware ya verificó el token y puso el usuario/admin en req
    const usuario = req.usuario || req.admin;
    
    if (!usuario) {
      return res.status(401).json({ 
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }

    res.json({
      valido: true,
      usuario: usuario.toSafeJSON(),
      tipo: req.admin ? 'admin' : 'usuario'
    });

  } catch (error) {
    console.error('Error en verificarToken:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};