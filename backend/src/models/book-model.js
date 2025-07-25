/**
 * Modelo Book: representa los libros en el sistema.
 */

/*- Imports -*/
// Tipos de datos de Sequelize.
const { DataTypes } = require('sequelize');

// Instancia de conexion a la base de datos.
const sequelize = require('../config/database');

// Generador de UUIDs unicos.
const { v4 } = require('uuid');

// Importa el modelo Author para la relacion.
const Author = require('./author-model');

/*- Modelo -*/
// Definicion del modelo Book.
const Book = sequelize.define('Book', {

  // ID unico para cada libro.
  id: {
    type        : DataTypes.UUID,
    defaultValue: () => v4(), // Generado automaticamente
    primaryKey  : true,
  },
  
  // Titulo del libro.
  title: {
    type     : DataTypes.STRING,
    allowNull: false,
  },

  // ISBN unico del libro.
  isbn: {
    type     : DataTypes.STRING,
    allowNull: false,
    unique   : true,
  },

  // ID del autor (relacion con Author).
  authorId: {
    type      : DataTypes.UUID,
    allowNull : false,
    references: { model: 'authors', key  : 'id' },
    onDelete  : 'CASCADE',
  },

  // Numero de páginas del libro.
  pageCount: {
    type     : DataTypes.INTEGER,
    allowNull: false,
  },

  // URL de la portada del libro.
  coverUrl: {
    type     : DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName : 'books',
  timestamps: false,
});

// relacion: un libro pertenece a un autor.
Book.belongsTo(Author, { foreignKey: 'authorId', onDelete: 'CASCADE' });

// relacion: un autor puede tener muchos libros.
Author.hasMany(Book, { foreignKey: 'authorId' });

module.exports = Book;