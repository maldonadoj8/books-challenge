// Libreria bcrypr para hashear contraseña.
const bcrypt = require('bcrypt');

// Libreria squelize para conexion con base de datos.
const sequelize = require('../src/config/database');

// Modelo user.
const User = require('../src/models/user-model');

async function init() {
  try {
    await sequelize.sync({ force: true });

    const password = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin@example.com', password });

    console.log('✅ Base de datos inicializada con tablas: users, authors, books');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al iniciar base de datos:', err);
    process.exit(1);
  }
}

init();