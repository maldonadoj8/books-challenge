/**
 * Middleware de autenticacion JWT para Express.
 * 
 * - Verifica que la peticion incluya un token JWT válido en el header 
 * Authorization.
 * - Si el token es valido, agrega el usuario decodificado a req.user y permite 
 * continuar.
 * - Si falta el token, responde con 401 (no autorizado).
 * - Si el token es invalido o expiro, responde con 403 (prohibido).
 * 
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 * @param {Function} next - Funcion next de Express.
 */

const jwt = require('jsonwebtoken');
const SECRET = 'envjwtsecret';

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if(!token) {
    return res.status(401).json({ message: 'Token no encontrado' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } 
  catch (err) {
    return res.status(403).json({ message: 'El token es invalido o expiro' });
  }
};