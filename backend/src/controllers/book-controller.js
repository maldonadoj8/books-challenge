/**
 * Controlador de libros: gestiona la logica para la entidad Book.
 */

/*- Imports -*/
// Importa operadores de Sequelize para consultas avanzadas.
const { Op } = require('sequelize');

// Importa validationResult para recoger y manejar los errores de validacion de 
// express-validator.
const { validationResult } = require('express-validator');

// Modelo Book y Author.
const Book = require('../models/book-model');
const Author = require('../models/author-model');

// Funcion para normalizar texto.
const normalizeText = require('../utils/text-utils');

// Funcion para parsear archivo CSV.
const parseCSV = require('../utils/csv-utils');

// Funcion para validar ISBN.
const validateIsbnSoap = require('../services/validate-isbn');

// Funcion para descargar imagen de caratula.
const fetchCover = require('../services/fetch-cover');

/*- Funciones -*/
/**
 * Lista libros paginados, con busqueda por titulo y autor.
 * Incluye datos del autor relacionado.
 */
exports.listBooks = async (req, res) => {
  // Parametros de la peticion con valores por default.
  const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
  const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;
  const offset = (page - 1) * limit;

  // Titulo y autor normalizados especificados en el query.
  const titleQuery = req.query.title ? normalizeText(req.query.title) : null;
  const authorQuery = req.query.author ? normalizeText(req.query.author) : null;

  try {
    // Construye filtros para consulta.
    const whereClause = {};
    const authorWhere = {};
    if(titleQuery) {
      whereClause.title = { [Op.like]: `%${titleQuery}%` };
    }
    if(authorQuery) {
      authorWhere.name = { [Op.like]: `%${authorQuery}%` };
    }

    // Consulta la base de datos para obtener libros paginados y el total.
    const { count, rows } = await Book.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Author,
          where: authorWhere,
          attributes: ['id', 'name', 'birthDate'],
        }
      ],
      offset,
      limit,
      order: [['title', 'ASC']],
    });

    // Responde con la lista de libros y datos de paginacion.
    res.json({
      total: count,
      page,
      pages: Math.ceil(count / limit),
      books: rows,
    });
  } 
  catch (err) {
    // Log de error.
    console.error(err);

    // Responde con mensaje de "500/Internal Server Error".
    res.status(500).json(
      { 
        message: 'Error al obtener libros', error: err.message 
      });
  }
};

/**
 * Obtiene un libro por su ID, incluyendo datos del autor.
 */
exports.getBookById = async (req, res) => {
  // Parametros de la peticion.
  const { id } = req.params;

  try {
    // Busca el libro por su ID e incluye los datos del autor.
    const book = await Book.findByPk(id, {
      include: {
        model     : Author,
        attributes: ['id', 'name', 'birthDate'],
      },
    });

    // Si no se encuentra un autor responde con mensaje "404/Not Found".
    if(!book) {
      return res.status(404).json(
        { 
          message: 'Libro no encontrado' 
        });
    }

    // Responde con libro encontrado.
    res.json(book);
  } 
  catch (err) {
    // Log de error.
    console.error(err);

    // Responde con mensaje de "500/Internal Server Error".
    res.status(500).json(
      { 
        message: 'Error al obtener libro', error: err.message 
      });
  }
};

/**
 * Crea un nuevo libro en la base de datos.
 */
exports.createBook = async (req, res) => {
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
  const { title, isbn, authorId, pageCount } = req.body;

  try {
    // Valida el ISBN usando servicio.
    const isValidIsbn = await validateIsbnSoap(isbn);

    // Si el ISBN no es valido.
    if(!isValidIsbn) {
      return res.status(400).json(
        { 
          message: 'ISBN invalido' 
        });
    }

    // Busca el autor por su ID.
    const author = await Author.findByPk(authorId);
    // Si no se encuentra un autor responde con mensaje "404/Not Found".
    if(!author) {
      return res.status(404).json(
        { 
          message: 'Autor no encontrado' 
        });
    }
    // Normaliza el titulo y obtiene la portada.
    const normalizedTitle = normalizeText(title);
    const coverUrl = await fetchCover(isbn);

    // Crea el libro en la base de datos.
    const book = await Book.create({
      title: normalizedTitle,
      isbn,
      authorId,
      pageCount,
      coverUrl,
    });

    // Devuelve el libro creado con mensaje "201/Created".
    res.status(201).json(book);
  } 
  catch (err) {
    // Log de error.
    console.error(err);

    // Responde con mensaje de "500/Internal Server Error".
    res.status(500).json(
      { 
        message: 'Error al crear libro', error: err.message 
      });
  }
};

/**
 * Actualiza los datos de un libro existente.
 */
exports.updateBook = async (req, res) => {
  // Obtiene los errores de validacion de la peticion.
  const errors = validationResult(req);
  
  // Si hay errores, responde con un mensaje "400/Petición mala".
  if(!errors.isEmpty()) {
    return res.status(400).json(
      { 
        errors: errors.array() 
      });
  }

  // Parametros de la peticion.
  const { id } = req.params;
  const { title, isbn, authorId, pageCount } = req.body;

  try {
    // Busca el libro por su ID.
    const book = await Book.findByPk(id);

    // Si no se encuentra un libro responde con mensaje "404/Not Found".
    if(!book) {
      return res.status(404).json(
        { 
          message: 'Libro no encontrado' 
        });
    }

    const updates = {};
    // Actualiza campos si se proporcionan.

    // Verifica cada campo a editar.
    if(title) {
      updates.title = normalizeText(title); 
    }
    if(pageCount) {
      updates.pageCount = pageCount;
    }
    if(isbn && isbn !== book.isbn) {
      // Valida el nuevo ISBN.
      const isValid = await validateIsbnSoap(isbn);

      // Si el ISBN no es valido responde con un mensaje "400/Petición mala". 
      if(!isValid) return res.status(400).json(
        { 
          message: 'ISBN invalido' 
        });
      updates.isbn = isbn;
      // Actualiza la caratula.
      updates.coverUrl = await fetchCover(isbn);
    }
    if(authorId && authorId !== book.authorId) {
      // Busca el autor por id.
      const author = await Author.findByPk(authorId);
      if(!author) {
        // Si no encuentra el autor responde con un mensaje "404/Not Found".
        return res.status(404).json(
          { 
            message: 'Autor no encontrado' 
          });
      }
      updates.authorId = authorId;
    }
    // Guarda los cambios en la base de datos.
    await book.update(updates);
    // Responde con el libro actualizado.
    res.json(book);
  } 
  catch (err) {
    // Log de error.
    console.error(err);

    // Responde con mensaje de "500/Internal Server Error".
    res.status(500).json(
      { 
        message: 'Error al actualizar libro', error: err.message 
      });
  }
};

/**
 * Elimina un libro por su ID.
 */
exports.deleteBook = async (req, res) => {
  // Parametros de la peticion.
  const { id } = req.params;

  try {
    // Encuentra un libro por su ID.
    const book = await Book.findByPk(id);
    
    // Si no se encuentra un libro responde con mensaje "404/Not Found".
    if(!book) {
      return res.status(404).json(
        { 
          message: 'Libro no encontrado' 
        });
    }
    
    // Elimina el libro encontrado.
    await book.destroy();

    // Responde con mensaje de confirmacion.
    res.json(
      { 
        message: 'Libro eliminado correctamente' 
      });
  } 
  catch (err) {
    // Log de error.
    console.error(err);

    // Responde con mensaje de "500/Internal Server Error".
    res.status(500).json(
      { 
        message: 'Error al eliminar libro', error: err.message 
      });
  }
};

/**
 * Valida un ISBN usando un servicio externo.
 */
exports.validateIsbn = async (req, res) => {
  // Parametros de la peticion.
  const { isbn } = req.params;
  
  try {
    // Valida el ISBN usando servicio.
    const isValid = await validateIsbnSoap(isbn);
    
    // Responde con resultado de validacion.
    res.json({ isbn, isValid });
  } 
  catch (err) {
    // Log de error.
    console.error(err);

    // Responde con mensaje de "500/Internal Server Error".
    res.status(500).json(
      { 
        message: 'Error al validar ISBN', error: err.message 
      });
  }
};

/**
 * Carga masiva de libros desde un archivo CSV.
 * Valida y normaliza cada fila, reportando errores por fila.
 */
exports.bulkImportBooks = async (req, res) => {
  try {
    // Verifica que se haya subido un archivo.
    if(!req.file) {
      return res.status(400).json(
        {
          message: 'No se cargo ningun archivo' 
        }); 
    }
    // Parsea el CSV y procesa cada fila.
    const rows = await parseCSV(req.file.buffer);
    
    const results = [];
    for(const [index, row] of rows.entries()) {
      const errors = [];
      let { title, isbn, authorId, authorName, pageCount } = row;
      const normalizedTitle = normalizeText(title);

      if(!normalizedTitle || normalizedTitle.length < 2) {
        errors.push('Titulo invalido'); 
      }
      if(!isbn || isbn.length !== 13) {
        errors.push('ISBN invalido'); 
      }
      if(!authorId && !authorName) {
        errors.push('Id o nombre de autor requerido');
      }
      if(!pageCount || isNaN(Number(pageCount))) {
        errors.push('Cantidad de paginas invalido');
      }

      // Encuentra un autor por id o nombre.
      let author = null;
      if(authorId && authorId.length === 36) {
        author = await Author.findByPk(authorId);
      }
      if(!author && authorName) {
        // Normaliza el nombre antes de buscar
        const normalizedAuthorName = normalizeText(authorName);
        author = await Author.findOne({ where: { name: normalizedAuthorName } });
      }
      if(!author) { 
        errors.push('Autor no encontrado'); 
      }

      // Valida el ISBN.
      const isValidISBN = await validateIsbnSoap(isbn);
      if(!isValidISBN) {
        errors.push('ISBN invalido'); 
      }
      let coverUrl = null;
      if(!errors.length) {
        try {
          // Descargar caratula.
          coverUrl = await fetchCover(isbn);
        } 
        catch {
          errors.push('Error al descargar caratula');
        }
      }
      if(errors.length) {
        results.push({ 
          row: index + 1, 
          status: 'failed',
          errors 
        });
      } 
      else {
        try {
          const book = await Book.create({
            title: normalizedTitle,
            isbn,
            authorId: author.id,
            pageCount: Number(pageCount),
            coverUrl,
          });
          results.push({ 
            row: index + 1, 
            status: 'success', 
            book 
          });
        } 
        catch (err) {
          results.push({ 
            row   : index + 1,
            status: 'failed',
            errors: [err.message]
          });
        }
      }
    }
    // Devuelve el resultado de la importación masiva.
    res.json({ total: results.length, results });
  } 
  catch (err) {
    // Log de error.
    console.error(err);

    // Responde con mensaje de "500/Internal Server Error".
    res.status(500).json(
      { 
        message: 'Error al procesar archivo', error: err.message 
      });
  }
};