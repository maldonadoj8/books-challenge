# Books Challenge Backend & Frontend


## Descripcion General
Este proyecto incluye una API backend en Node.js y un frontend en React para la gestion de libros, autores y usuarios, con autenticacion, importacion por CSV e integracion con servicios externos como descarga de caratulas de libros y validacion de ISBN.

### Herramientas y librerias clave
- **Sequelize**: ORM para la gestion de la base de datos SQLite. Investigue su uso y configuracion ya que no lo habia utilizado previamente.
- **SOAP**: Integracion para la validacion de ISBN. Tuve que investigar como consumir servicios SOAP desde Node.js.
- **Axios**: Cliente HTTP para llamadas a APIs externas y consumo de servicios REST y SOAP. Aprendi sobre su uso para peticiones y manejo de respuestas.
- **Swagger**: Documentacion interactiva de la API. Investigue como generar y exponer documentacion con swagger-jsdoc y swagger-ui-express.

Estas herramientas fueron nuevas para mi y requirieron investigacion y pruebas para integrarlas correctamente en el proyecto.

## Patrones Arquitectonicos
- **MVC (Modelo-Vista-Controlador):**
  - **Modelos** definen la estructura de datos y la logica ORM (Object-Relational Mapping).
  - **Controladores** gestionan la logica de negocio y las solicitudes.
  - **Rutas** mapean los endpoints HTTP a las acciones de los controladores.
  - **Middleware** provee funcionalidades como autenticacion, manejo de errores y subida de archivos).

- **Capa de Servicios:**
  - Integraciones externas (por ejemplo, OpenLibrary, validacion de ISBN via SOAP).

- **Capa de Validacion:**
  - Utiliza express-validator para la validacion de solicitudes, separada en modulos de validacion dedicados.

## Librerias y Frameworks Utilizados
- **Node.js & Express:** Framework principal del servidor y enrutamiento.
- **Sequelize:** ORM para la gestion de la base de datos SQLite.
- **express-validator:** Middleware para validacion de solicitudes.
- **jsonwebtoken:** autenticacion basada en JWT.
- **bcrypt:** Hashing de contrasenas para seguridad de usuarios.
- **multer:** Manejo de subida de archivos (importacion CSV).
- **csv-parse:** Parseo de archivos CSV para importacion masiva de libros.
- **axios:** Cliente HTTP para llamadas a APIs externas (OpenLibrary, SOAP).
- **swagger-jsdoc & swagger-ui-express:** Documentacion de la API en `/api-docs`.
- **React:** Libreria para la construccion de componentes.


## Como ejecutar ambos proyectos juntos
Puedes iniciar tanto el backend como el frontend con un solo comando, sin necesidad de instalar dependencias manualmente:

### En Linux/macOS/WSL:
sh start.sh

### En Windows:
start.bat

Esto instalara las dependencias, inicializara la base de datos y levantara ambos servidores automaticamente.

## Documentacion de la API
La documentacion interactiva de la API esta disponible en:
```
http://localhost:3000/api-docs
```
Una vez iniciado el backend, puedes consultar y probar los endpoints desde esa URL.

## Usuario para usar el sistema
Usuario: admin@example.com
Password: admin123

Para facilidad de usos omite temas de seguridad como ocultar ocultar palabra secreta para firmar contrasenas o usuarios en repositorio.

## Archivo para carga masiva
Se incluye un archivo csv 'libros-validos-1.csv' para probar la funcionalidad de carga masiva.
De igual manera se puede cargar un archivo personalizado con las columnas title, isbn, authorName y pageCount.
Tome esta estructura ya que el ejercicio no mencionaba una estandar.