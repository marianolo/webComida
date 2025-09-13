// migrateDB.js
const sequelize = require('./config/db');
const { Admin, Usuario } = require('./models');

async function migrarBaseDatos() {
  try {
    console.log('🔄 Iniciando migración de base de datos...');
    
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    // Opción 1: Sincronización con alter (conserva datos)
    await sequelize.sync({ alter: true });
    console.log('✅ Base de datos sincronizada con alter');

    // Verificar que las tablas existen y tienen las columnas correctas
    const adminTableInfo = await sequelize.getQueryInterface().describeTable('admins');
    const usuarioTableInfo = await sequelize.getQueryInterface().describeTable('usuarios');

    console.log('📋 Columnas de tabla admins:', Object.keys(adminTableInfo));
    console.log('📋 Columnas de tabla usuarios:', Object.keys(usuarioTableInfo));

    // Verificar si último_acceso existe
    if (!adminTableInfo.ultimo_acceso) {
      console.log('⚠️ Columna ultimo_acceso no existe en admins');
      await sequelize.getQueryInterface().addColumn('admins', 'ultimo_acceso', {
        type: 'DATETIME',
        allowNull: true
      });
      console.log('✅ Columna ultimo_acceso agregada a admins');
    }

    if (!usuarioTableInfo.ultimo_acceso) {
      console.log('⚠️ Columna ultimo_acceso no existe en usuarios');
      await sequelize.getQueryInterface().addColumn('usuarios', 'ultimo_acceso', {
        type: 'DATETIME',
        allowNull: true
      });
      console.log('✅ Columna ultimo_acceso agregada a usuarios');
    }

    console.log('🎉 Migración completada exitosamente');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error en migración:', error);
    
    if (error.name === 'SequelizeDatabaseError') {
      console.log('\n💡 Sugerencias:');
      console.log('1. Verifica que la base de datos existe');
      console.log('2. Verifica las credenciales de conexión');
      console.log('3. Considera usar { force: true } si no hay datos importantes');
    }
    
    process.exit(1);
  }
}

// Función alternativa: recrear todo (BORRA DATOS)
async function recrearBaseDatos() {
  try {
    console.log('⚠️ ADVERTENCIA: Esto eliminará todos los datos');
    console.log('🔄 Recreando base de datos...');
    
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    
    console.log('✅ Base de datos recreada exitosamente');
    console.log('🔄 Creando admin inicial...');
    
    // Recrear admin
    await Admin.create({
      nombre: 'Mariano Lopez',
      email: 'marianoo11loopez@gmail.com',
      password: 'Mariano11', // Se hasheará automáticamente
      rol: 'super_admin',
      activo: true
    });
    
    console.log('✅ Admin recreado exitosamente');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error al recrear:', error);
    process.exit(1);
  }
}

// Ejecutar migración normal por defecto
const args = process.argv.slice(2);
if (args.includes('--force')) {
  recrearBaseDatos();
} else {
  migrarBaseDatos();
}