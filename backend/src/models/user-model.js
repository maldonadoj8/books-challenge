/**
 * Modelo User: representa a los usuarios del sistema para autenticacion y 
 * autorización. 
 */

/*- Imports -*/
// Tipos de datos de Sequelize.
const { DataTypes } = require('sequelize'); 

// Instancia de conexion a la base de datos.
const sequelize = require('../config/database');

// Generador de UUIDs unicos.
const { v4 } = require('uuid');

/*- Modelo -*/
// Definicion del modelo User.
const User = sequelize.define('User', {

  // ID unico para cada usuario.
  id: {
    type        : DataTypes.UUID,
    defaultValue: () => v4(), // Generado automaticamente
    primaryKey  : true,
  },

  // Nombre de usuario unico.
  username: {
    type     : DataTypes.STRING,
    unique   : true,
    allowNull: false,
  },

  // Contraseña hasheada del usuario.
  password: {
    type     : DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;