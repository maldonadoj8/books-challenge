/**
 * Controlador de autenticacion: gestiona el login de usuarios y la generacion 
 * de JWT.
 */

/*- Imports -*/
// Libreria para generar JWTs.
const jwt = require('jsonwebtoken');

// Libreria para hash y comparacion de contraseñas.
const bcrypt = require('bcrypt');

// Modelo User.
const User = require('../models/user-model');

// Clave para verificar los JWT (idealmente en archivo secreto/env).
const SECRET = 'envjwtsecret';

/*- Funciones -*/
/**
 * Realiza el login de usuario.
 */
exports.login = async (req, res) => {
  // Parametros de la peticion.
  const { username, password } = req.body; 

  try {
    // Encuentra un usuario por nombre de usuario.
    const user = await User.findOne({ where: { username } });

    // Si no se encuentra un usuario responde con mensaje "401/Unauthorized".
    if(!user) {
      return res.status(401).json(
        { 
          message: 'Credenciales invalidas'  
        });
    }

    // Compara contraseña.
    const match = await bcrypt.compare(password, user.password);

    // Si no coinciden las contraseñas responde con mensaje "401/Unauthorized".
    if(!match) {
      return res.status(401).json(
        { 
          message: 'Credenciales invalidas' 
        });
    }

    // Genera un JWT.
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });

    // Responde con TOKEN generado.
    res.json({ token });
  } 
  catch (err) {
    // Log de error.
    console.error(err);

    // Responde con mensaje de "500/Internal Server Error".
    res.status(500).json(
      { 
        message: 'Error en el servidor' 
      });
  }
};
