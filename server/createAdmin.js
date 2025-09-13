// createAdmin.js
const bcrypt = require('bcrypt');
const sequelize = require('./config/db');
const Admin = require('./models/Admin');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('🟢 Conectado a la base de datos.');

    await sequelize.sync(); // Crea la tabla si no existe

    const hashedPassword = await bcrypt.hash('Mariano11', 10);

    await Admin.create({
      nombre: 'Mariano Lopez',
      email: 'marianoo11loopez@gmail.com',
      password: hashedPassword,
      rol: 'super_admin', 
      activo: true
    });

    console.log('✅ Admin creado con éxito.');
    process.exit();
  } catch (error) {
    console.error('❌ Error al crear admin:', error);
    process.exit(1);
  }
})();
