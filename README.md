# Books Challenge Backend

## Descripción General
Este proyecto es una API backend en Node.js para la gestión de libros, autores y 
usuarios, con autenticacion, importación por CSV e integración con servicios 
externos como descarga de caratulas de libros o validación de ISBN.

## Patrones Arquitectónicos

- **MVC (Modelo-Vista-Controlador):**
  - **Modelos** definen la estructura de datos y la logica ORM 
  (Object-Relational Mapping).
  - **Controladores** gestionan la logica de negocio y las solicitudes.
  - **Rutas** mapean los endpoints HTTP a las acciones de los controladores.
  - **Middleware** provee funcionalidades transversales (autenticacion, manejo 
  de errores, subida de archivos).

- **Capa de Servicios:**
  - Integraciones externas (por ejemplo, OpenLibrary, validación de 
  ISBN vía SOAP) y logica de negocio reutilizable.

- **Capa de Validación:**
  - Utiliza express-validator para la validación de solicitudes, separada en 
  módulos de validación dedicados.

- **Capa de Utilidades:**
  - Funciones auxiliares comunes (por ejemplo, normalización de texto, parseo de 
  CSV) están aisladas en `utils/`.

- **Capa de Scripts:**
  - Scripts independientes para la inicialización y carga de datos en la base de 
  datos.

## Estructura de Carpetas

```
backend/
├── database.sqlite           # Archivo de base de datos SQLite
├── package.json              # Dependencias y scripts del proyecto
├── scripts/                  # Scripts independientes para setup y carga de datos
│   ├── add-book.js
│   └── init-db.js
├── src/
│   ├── index.js              # Punto de entrada de la app Express
│   ├── config/               # Archivos de configuración (DB, Swagger)
│   │   ├── database.js
│   │   └── swagger.js
│   ├── controllers/          # logica de manejo de rutas
│   ├── middleware/           # Middleware de Express (auth, errores, uploads)
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── uploadMiddleware.js
│   ├── models/               # Modelos Sequelize (Book, Author, User)
│   │   ├── Author.js
│   │   ├── Book.js
│   │   └── User.js
│   ├── routes/               # Definicion de rutas Express
│   │   ├── authorRoutes.js
│   │   ├── authRoutes.js
│   │   └── bookRoutes.js
│   ├── services/             # Integraciones con APIs/servicios externos
│   │   ├── fetchCoverFromOpenLibrary.js
│   │   └── validateIsbnWithSoap.js
│   ├── utils/                # Funciones auxiliares
│   │   ├── normalizeText.js
│   │   └── parseCSV.js
│   └── validators/           # logica de validación de solicitudes
│       ├── author-validator.js
│       └── book-validator.js
└── tests/                    # (Opcional) Tests automatizados
```


## Librerías y Frameworks Utilizados

- **Node.js & Express:** Framework principal del servidor y enrutamiento.
- **Sequelize:** ORM para la gestión de la base de datos SQLite.
- **express-validator:** Middleware para validación de solicitudes.
- **jsonwebtoken:** autenticacion basada en JWT.
- **bcrypt:** Hashing de contraseñas para seguridad de usuarios.
- **multer:** Manejo de subida de archivos (importación CSV).
- **csv-parse:** Parseo de archivos CSV para importación masiva de libros.
- **axios:** Cliente HTTP para llamadas a APIs externas (OpenLibrary, SOAP).
- **swagger-jsdoc & swagger-ui-express:** Documentación de la API en `/api-docs`.


## Funcionalidades Clave

- autenticacion JWT y gestión de usuarios
- CRUD de autores y libros
- Validación de ISBN-13 vía SOAP
- Obtención de portadas de libros desde OpenLibrary
- Importación masiva de libros vía CSV
- Código modular, testeable y extensible


## Primeros Pasos

1. Instalar dependencias:
   ```sh
   npm install
   ```
2. Inicializar la base de datos:
   ```sh
   node scripts/init-db.js
   ```
3. Iniciar el servidor:
   ```sh
   npm start
   ```
4. Acceder a la documentación de la API en `http://localhost:3000/api-docs`