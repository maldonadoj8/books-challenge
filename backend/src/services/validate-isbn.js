// Libreria SOAP.
const soap = require('soap');

// URL del servicio de validacion ISBN.
const URL = 'https://webservices.daehosting.com/services/isbnservice.wso?wsdl';

/**
 * Valida un ISBN usando un servicio SOAP.
 * 
 * - Utiliza el servicio de daehosting.com para verificar si el ISBN es valido.
 * - Si ocurre un error en la consulta, retorna false.
 * 
 * @param {string} isbn - ISBN a validar.
 * @returns {Promise<boolean>} true si es valido, false si no.
 */

async function validateIsbnSoap(isbn) {
  try {
    const client = await soap.createClientAsync(URL);
    const [result] = await client.IsValidISBN13Async({ sISBN: isbn });
    return result.IsValidISBN13Result;
  } 
  catch (err) {
    // Log de error.
    console.error('Error en servicio SOAP:', err.message);
    return false;
  }
}

module.exports = validateIsbnSoap;