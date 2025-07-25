 // Importa libreria sequelize.
const { Sequelize } = require('sequelize');

const path = require('path');

/**
 * Configuración de la conexión a la base de datos con Sequelize.
 * 
 * - Usa SQLite como motor de base de datos.
 */
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false,
});

module.exports = sequelize;