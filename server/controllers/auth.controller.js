const { Usuario, Admin } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Función para generar JWT
const generateToken = (user, role = 'user') => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: role 
    },
    process.env.JWT_SECRET || 'tu_clave_secreta',
    { expiresIn: '24h' }
  );
};

// Registro de usuario
exports.registro = async (req, res) => {
  try {
    const { nombre, telefono, direccion, email, password } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      telefono,
      direccion,
      email,
      password: hashedPassword
    });

    // Generar token
    const token = generateToken(nuevoUsuario);

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      user: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        telefono: nuevoUsuario.telefono,
        direccion: nuevoUsuario.direccion
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = generateToken(usuario);

    res.json({
      mensaje: 'Login exitoso',
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Login de administrador
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar admin
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, admin.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = generateToken(admin, 'admin');

    res.json({
      mensaje: 'Login admin exitoso',
      token,
      admin: {
        id: admin.id,
        nombre: admin.nombre,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Error en login admin:', error);
    res.status(500).json({ error: 'Error al iniciar sesión como admin' });
  }
};