const { Admin } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ where: { email } });
  if (!admin) return res.status(404).json({ error: 'Admin no encontrado' });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const token = jwt.sign({ id: admin.id }, 'secretoadmin', { expiresIn: '1d' });
  res.json({ admin, token });
};
