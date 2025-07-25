/**
 * @swagger
 * tags:
 *   name: Libros
 *   description: Endpoints para gestión de libros
 */

/**
 * @swagger
 * /libros:
 *   get:
 *     summary: Lista libros paginados y permite búsqueda por título y autor
 *     tags: [Libros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: Tamaño de página
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Búsqueda por título
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Búsqueda por autor
 *     responses:
 *       200:
 *         description: Lista de libros
 */

/**
 * @swagger
 * /libros/{id}:
 *   get:
 *     summary: Obtiene un libro por su ID
 *     tags: [Libros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del libro
 *     responses:
 *       200:
 *         description: Libro encontrado
 *       404:
 *         description: Libro no encontrado
 */

/**
 * @swagger
 * /libros:
 *   post:
 *     summary: Crea un nuevo libro
 *     tags: [Libros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - isbn
 *               - authorId
 *               - pageCount
 *             properties:
 *               title:
 *                 type: string
 *                 example: Ficciones
 *               isbn:
 *                 type: string
 *                 example: 9780307474728
 *               authorId:
 *                 type: string
 *                 format: uuid
 *               pageCount:
 *                 type: integer
 *                 example: 200
 *     responses:
 *       201:
 *         description: Libro creado
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /libros/{id}:
 *   patch:
 *     summary: Actualiza un libro existente
 *     tags: [Libros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del libro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Ficciones (Edición Revisada)
 *               isbn:
 *                 type: string
 *                 example: 9780307474728
 *               authorId:
 *                 type: string
 *                 format: uuid
 *               pageCount:
 *                 type: integer
 *                 example: 220
 *     responses:
 *       200:
 *         description: Libro actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Libro no encontrado
 */

/**
 * @swagger
 * /libros/{id}:
 *   delete:
 *     summary: Elimina un libro por su ID
 *     tags: [Libros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del libro
 *     responses:
 *       200:
 *         description: Libro eliminado
 *       404:
 *         description: Libro no encontrado
 */

/**
 * @swagger
 * /libros/validacion/{isbn}:
 *   get:
 *     summary: Valida un ISBN usando un servicio externo
 *     tags: [Libros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *         description: ISBN a validar
 *     responses:
 *       200:
 *         description: ISBN válido o inválido
 */

/**
 * @swagger
 * /libros/masivo:
 *   post:
 *     summary: Importa libros en lote desde un archivo CSV
 *     tags: [Libros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Libros importados exitosamente
 *       400:
 *         description: Archivo inválido o error de formato
 */

/**
 * Rutas de libros.
 */

// Utilidades express.
const express = require('express');
const router = express.Router();

// Middleware de autenticacion para proteger las rutas.
const auth = require('../middleware/auth-middleware');

// Middleware para subida de archivos.
const uploader = require('../middleware/upload-middleware');

// Validador de datos para libros.
const { 
  validateBookCreate, 
  validateBookUpdate 
} = require('../validators/book-validator');

// Controlador de libros.
const bookController = require('../controllers/book-controller');

// Aplica autenticacion a todas las rutas de este router.
router.use(auth);

// GET /libros - Lista libros paginados y permite busqueda.
router.get('/', bookController.listBooks);

// GET /libros/:id - Obtiene un libro por su ID.
router.get('/:id', bookController.getBookById);

// POST /libros - Crea un nuevo libro (requiere validacion de datos).
router.post('/', validateBookCreate, bookController.createBook);

// PATCH /libros/:id - Actualiz un libro (requiere validacion de datos).
router.patch('/:id', validateBookUpdate, bookController.updateBook);

// DELETE /libros/:id - Elimina un libro por su ID.
router.delete('/:id', bookController.deleteBook);

// GET /libros/validacion/:isbn - Valida un ISBN usando un servicio externo.
router.get('/validacion/:isbn', bookController.validateIsbn);

// POST /libros/masivo - Importa libros en lote desde un archivo CSV.
router.post('/masivo', uploader.single('file'), bookController.bulkImportBooks);

module.exports = router;