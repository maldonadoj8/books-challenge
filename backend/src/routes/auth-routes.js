/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para autenticación de usuarios
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión y devuelve un JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Autenticación exitosa, devuelve el token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 */

/**
 * Rutas de autenticacion.
 */

// Utilidades express.
const express = require('express');
const router = express.Router();

// Controlador de autenticacion.
const authController = require('../controllers/auth-controller');

// POST /login - Inicia sesion y devuelve un JWT.
router.post('/', authController.login);

module.exports = router;