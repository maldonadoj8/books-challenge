// Herramientas express.
const express = require('express');
const app = express();

// Configuracion CORS.
const cors = require('cors');

/*- Rutas -*/
const authRoutes = require('./routes/auth-routes');
const authorRoutes = require('./routes/author-routes');
const bookRoutes = require('./routes/book-routes');

// Error handler generico.
const errorHandler = require('./middleware/error-handler');

// Configuracion para documentacion de apis con swagger.
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Configuracion de aplicacion.
app.use(express.json());
app.use(cors({
  origin     : 'http://localhost:3001',
  credentials: true
}));
app.use('/login', authRoutes);
app.use('/autores', authorRoutes);
app.use('/libros', bookRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Loggin de errores.
app.use(errorHandler);

// Puerto para aplicacion.
const PORT = process.env.PORT || 3000;

// Inicia servidor.
app.listen(PORT, () => console.log(`Servidor listo en puerto: ${PORT}`));

// Export para tests.
module.exports = app; 