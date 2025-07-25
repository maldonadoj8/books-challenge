/**
 * Validadores para operaciones con autores.
 */

// Utilidades express.
const { body } = require('express-validator');

// Validador creacion.
const validateAuthorCreate = [
  body('name')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('birthDate')
    .notEmpty()
    .withMessage('La fecha de nacimiento es requerida')
    .isISO8601()
    .withMessage('La fecha de nacimiento debe ser una fecha valida'),
];

// Validador actualizacion.
const validateAuthorUpdate = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    
  body('birthDate')
    .optional()
    .notEmpty()
    .withMessage('La fecha de nacimiento es requerida')
    .isISO8601()
    .withMessage('La fecha de nacimiento debe ser una fecha valida'),
];

module.exports = {
  validateAuthorCreate,
  validateAuthorUpdate,
};