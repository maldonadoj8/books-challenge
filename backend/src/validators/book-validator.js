/**
 * Validadores para operaciones con libros.
 */

// Utilidades express.
const { body } = require('express-validator');

// Validador creacion.
const validateBookCreate = [
  body('title')
    .notEmpty()
    .withMessage('El titulo es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El titulo debe tener entre 2 y 100 caracteres'),

  body('isbn')
    .notEmpty()
    .withMessage('El ISBN es requerido')
    .isLength({ min: 10, max: 13 })
    .withMessage('El ISBN debe tener entre 10 y 17 caracteres'),

  body('authorId')
    .notEmpty()
    .withMessage('El ID del autor es requerido')
    .isUUID()
    .withMessage('El ID del autor debe ser un UUID valido'),

  body('pageCount')
    .notEmpty()
    .withMessage('La cantidad de paginas es requerida')
    .isInt({ min: 1 })
    .withMessage('La cantidad de paginas debe ser un numero positivo'),
];

// Validador actualizacion.
const validateBookUpdate = [
  body('title')
    .optional()
    .notEmpty().withMessage('El titulo es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El titulo debe tener entre 2 y 100 caracteres'),

  body('isbn')
    .optional()
    .notEmpty().withMessage('El ISBN es requerido')
    .isLength({ min: 10, max: 13 })
    .withMessage('El ISBN debe tener entre 10 y 17 caracteres'),

  body('authorId')
    .optional()
    .notEmpty().withMessage('El ID del autor es requerido')
    .isUUID().withMessage('El ID del autor debe ser un UUID valido'),

  body('pageCount')
    .optional()
    .notEmpty()
    .withMessage('La cantidad de paginas es requerida')
    .isInt({ min: 1 })
    .withMessage('La cantidad de paginas debe ser un numero positivo'),
];

module.exports = {
  validateBookCreate,
  validateBookUpdate,
};