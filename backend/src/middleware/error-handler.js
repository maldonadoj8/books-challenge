/**
 * Middleware de manejo centralizado de errores para Express.
 * 
 * - Captura cualquier error que ocurra en las rutas o controladores.
 * - Imprime el stack trace del error en consola para facilitar el debug.
 * - Devuelve una respuesta JSON con status 500 y el mensaje del error.
 * 
 * @param {Error} err - Objeto de error lanzado.
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 * @param {Function} next - Función next de Express.
 */
module.exports = (err, req, res, next) => {
  // Log de error.
  console.error(err.stack);

  // Responde con un mensaje "500/Internal Server Error".
  res.status(500).json(
    { 
      message: err.message 
    });
};