/**
 * Controlador de autores: gestiona la logica para la entidad Author.
 */

/*- Imports -*/
// Importa validationResult para recoger y manejar los errores de validacion de 
// express-validator.
const { validationResult } = require('express-validator');

// Modelo Author.
const Author = require('../models/author-model');

// Funcion para normalizar texto.
const normalizeText = require('../utils/text-utils');

/*- Funciones -*/
/**
 * Lista autores paginados, ordenados alfabeticamente.
 */
exports.listAuthors = async (req, res) => {
  // Parametros de la peticion con valores por default.
  const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
  const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;
  const offset = (page - 1) * limit;
  
  try {
    // Consulta la base de datos para obtener autores paginados.
    const { count, rows } = await Author.findAndCountAll({
      limit,
      offset,
      order: [['name', 'ASC']],
    });

    // Responde con la lista de autores y datos de paginacion.
    res.json({
      total: count,
      page,
      pages: Math.ceil(count / limit),
      authors: rows,
    });
  } 
  catch (err) {
    // Log de error.
    console.error(err);

    // Responde con mensaje de "500/Internal Server Error".
    res.status(500).json(
      { 
        message: 'Error al obtener autores', error: err.message 
      });
  }
};

/**
 * Crea un nuevo autor en la base de datos.
 */
exports.createAuthor = async (req, res) => {
  // Obtiene los errores de validacion de la peticion.
  const errors = validationResult(req);

  // Si hay errores, responde con estado 400 y los detalles.
  if(!errors.isEmpty()) {
    return res.status(400).json(
      { 
        errors: errors.array() 
      });
  }
  try {
    // Normaliza el nombre recibido.
    const name = normalizeText(req.body.name);
    
    // Obtiene la fecha de nacimiento.
    const birthDate = req.body.birthDate;

    // Crea el autor en la base de datos.
    const author = await Author.create({ name, birthDate });
    
    // Devuelve el autor creado con mensaje "201/Created".
    res.status(201).json(author);
  } 
  catch (err) {
    // Log de error.
    console.error(err);

    // Responde con mensaje de "500/Internal Server Error".
    res.status(500).json(
      { 
        message: 'Error al crear el autor', error: err.message 
      });
  }
};

/**
 * Actualiza los datos de un autor existente.
 */
exports.updateAuthor = async (req, res) => {
  // Obtiene los errores de validacion de la peticion.
  const errors = validationResult(req);
  
  // Si hay errores, responde con estado 400 y los detalles.
  if(!errors.isEmpty()) {
    return res.status(400).json(
      { 
        errors: errors.array() 
      });
  }

  // Parametros de la peticion.
  const { id } = req.params;
  const { name, birthDate } = req.body;

  try {
    // Busca el autor por su ID.
    const author = await Author.findByPk(id);

    // Si no se encuentra un autor responde con mensaje "404/Not Found".
    if(!author) {
      return res.status(404).json(
        { 
          message: 'Autor no encontrado' 
        });
    }
    // Verifica cada campo a editar.
    if(name) {
      author.name = normalizeText(req.body.name);
    }
    if(birthDate) {
      author.birthDate = req.body.birthDate;
    }
    // Guarda los cambios en la base de datos.
    await author.save();
    // Responde con el autor actualizado.
    res.json(author);
  } 
  catch (err) {
    // Log de error.
    console.error(err);

    // Responde con mensaje de "500/Internal Server Error".
    res.status(500).json(
      { 
        message: 'Error al actualizar autor', error: err.message 
      });
  }
};

/**
 * Elimina un autor por su ID.
 */
exports.deleteAuthor = async (req, res) => {
  // Parametros de la peticion.
  const { id } = req.params;

  try {
    // Encuentra un autor por id.
    const author = await Author.findByPk(id);

    // Si no se encuentra un autor responde con mensaje "404/Not Found".
    if(!author) {
      return res.status(404).json(
        { 
          message: 'Autor no encontrado' 
        });
    }
    // Eliminar el autor encontrado.
    await author.destroy();

    // Responde con mensaje de confirmacion.
    res.json(
      { 
        message: 'Autor eliminado correctamente' 
      });
  } 
  catch (err) {
    // Log de error.
    console.error(err);

    // Responde con mensaje de "500/Internal Server Error".
    res.status(500).json(
      { 
        message: 'Error al eliminar autor', error: err.message 
      });
  }
};