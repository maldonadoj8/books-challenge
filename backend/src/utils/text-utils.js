/**
 * Normaliza un texto:
 * - Separa los acentos de las letras.
 * - Elimina los acentos.
 * - Elimina numeros y caracteres especiales, solo deja letras y espacios.
 * - Reemplaza multiples espacios por uno solo.
 * - Elimina espacios al inicio y final.
 * - Convierte todo a mayusculas.
 * 
 * @param {string} str - Texto a normalizar.
 * @returns {string} Texto normalizado.
 */
const normalizeText = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z ]/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
};

module.exports = normalizeText;