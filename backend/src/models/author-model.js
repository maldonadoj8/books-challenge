/**
 * Modelo Author: representa a los autores de libros en el sistema.
 */

/*- Imports -*/
// Tipos de datos de Sequelize.
const { DataTypes } = require('sequelize');

// Instancia de conexion a la base de datos.
const sequelize = require('../config/database');

// Generador de UUIDs unicos.
const { v4 } = require('uuid');

/*- Modelo -*/
// Definicion del modelo Author.
const Author = sequelize.define('Author', {
  
  // ID unico para cada autor.
  id: {
    type        : DataTypes.UUID,
    defaultValue: () => v4(),   // Generado automaticamente.
    primaryKey  : true,
  },

  // Nombre del autor.
  name: {
    type     : DataTypes.STRING,
    allowNull: false,
  },

  // Fecha de nacimiento del autor.
  birthDate: {
    type     : DataTypes.DATEONLY,
    allowNull: false,
  }
}, {
  tableName : 'authors',
  timestamps: false,
});

module.exports = Author;