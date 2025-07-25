/**
 * @swagger
 * tags:
 *   name: Autores
 *   description: Endpoints para gestión de autores
 */

/**
 * @swagger
 * /autores:
 *   get:
 *     summary: Lista autores paginados
 *     tags: [Autores]
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
 *     responses:
 *       200:
 *         description: Lista de autores
 */

/**
 * @swagger
 * /autores:
 *   post:
 *     summary: Crea un nuevo autor
 *     tags: [Autores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - birthDate
 *             properties:
 *               name:
 *                 type: string
 *                 example: Julio Cortázar
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 1914-08-26
 *     responses:
 *       201:
 *         description: Autor creado
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /autores/{id}:
 *   patch:
 *     summary: Actualiza un autor existente
 *     tags: [Autores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del autor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Julio F. Cortázar
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 1914-08-26
 *     responses:
 *       200:
 *         description: Autor actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Autor no encontrado
 */

/**
 * @swagger
 * /autores/{id}:
 *   delete:
 *     summary: Elimina un autor por su ID
 *     tags: [Autores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del autor
 *     responses:
 *       200:
 *         description: Autor eliminado
 *       404:
 *         description: Autor no encontrado
 */

/**
 * Rutas de autores.
 */

// Utilidades express.
const express = require('express');
const router = express.Router();

// Middleware de autenticacion para proteger las rutas.
const auth = require('../middleware/auth-middleware');

// Validador de datos para autores.
const { 
  validateAuthorCreate, 
  validateAuthorUpdate 
} = require('../validators/author-validator');

// Controlador de autor.
const authorController = require('../controllers/author-controller');

// Aplica autenticacion a todas las rutas de este router.
router.use(auth);

// GET /autores - Lista autores paginados.
router.get('/', authorController.listAuthors);

// POST /autores - Crea un nuevo autor (requiere validación de datos).
router.post('/', validateAuthorCreate, authorController.createAuthor);

// PATCH /autores/:id - Actualiza un autor (requiere validación de datos).
router.patch('/:id', validateAuthorUpdate, authorController.updateAuthor);

// DELETE /autores/:id - Elimina un autor por su ID.
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;