// Libreria axios.
const axios = require('axios');

/**
 * Obtiene la URL de la portada de un libro usando el API de OpenLibrary.
 * 
 * - Realiza una petición HTTP a OpenLibrary usando el ISBN proporcionado.
 * - Si encuentra la portada, devuelve la URL de la imagen (tamaño medio).
 * - Si no encuentra portada o hay un error, devuelve null.
 * 
 * @param {string} isbn - ISBN del libro a consultar.
 * @returns {Promise<string|null>} URL de la portada o null si no existe.
 */
async function fetchCover(isbn) {
  try {
    const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
    const { data } = await axios.get(url);
    const bookData = data[`ISBN:${isbn}`];
    if(bookData?.cover.medium) {
      return bookData.cover.medium;
    }
    return null;
  } 
  catch (err) {
    console.error('Error fetching cover from OpenLibrary:', err.message);
    return null;
  }
}

module.exports = fetchCover;