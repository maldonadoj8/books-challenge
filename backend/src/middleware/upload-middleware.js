/**
 * Middleware de subida de archivos usando Multer.
 * 
 * - Almacena los archivos en memoria (no en disco).
 * - Solo permite archivos con extensión .csv.
 * - Si el archivo no es .csv, retorna un error.
 * 
 * @module uploader
 */

/*- Imports -*/
// Libreria multer.
const multer = require('multer');

const path = require('path');

// Guardar archivos en memoria.
const storage = multer.memoryStorage();

// Filtro para aceptar solo archivos .csv
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.csv') cb(null, true);
  else cb(new Error('Solo archivos .csv son permitidos'), false);
};

// Inicializa el middleware de subida con la configuracion anterior.
const uploader = multer({ storage, fileFilter });

module.exports = uploader;