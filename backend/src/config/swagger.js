/*- Imports -*/
// Importa libreria swagger.
const swaggerJSDoc = require('swagger-jsdoc');

/**
 * Configuración de Swagger para la documentacion de la API.
 * 
 * - Usa swagger-jsdoc para generar el esquema OpenAPI a partir de anotaciones 
 * en las rutas.
 * - Define el esquema de seguridad JWT (bearerAuth).
 * - Busca anotaciones en todos los archivos de rutas dentro de src/routes.
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;