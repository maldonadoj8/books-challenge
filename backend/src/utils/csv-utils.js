/*- Imports -*/
 // Importa parser de CSV.
const csv = require('csv-parser');

// Importa utilidades de stream.
const { Readable } = require('stream'); 

/**
 * Parsea un archivo CSV a un arreglo de objetos.
 * 
 * - Usa el paquete 'csv-parser' para procesar el contenido.
 * - Convierte el buffer recibido a string y lo procesa como stream.
 * - Devuelve una promesa que resuelve con los datos parseados.
 * 
 * @param {Buffer} buffer - Buffer del archivo CSV.
 * @returns {Promise<Array<Object>>} Arreglo de objetos con los datos del CSV.
 */

async function parseCSV(buffer) {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer.toString());

    stream
      .pipe(csv({ separator: ',', skipLines: 0 }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

module.exports = parseCSV;