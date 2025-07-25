// Peticiones con Supertest.
const request = require('supertest');

// Aplicacion principal.
const app = require('../src/index');

// Base de datos con Squelize.
const sequelize = require('../src/config/database');

// Libreria para hash y comparacion de contraseñas.
const bcrypt = require('bcrypt');

// Modelos de datos.
const User = require('../src/models/user-model');
const Author = require('../src/models/author-model');

// Variables auxiliares para los test.
let token;
let createdAuthorId;
let authorId;
let bookId;

/*- Test -*/
// Configuracion inicial para cada iteracion.
beforeAll(async () => {
  // Reinicia base de datos.
  await sequelize.sync({ force: true });

  // Registro de usuario inicial.
  const password = await bcrypt.hash('admin123', 10);
  await User.create({ username: 'admin', password });

  // Login para obtener token.
  const res = await request(app)
    .post('/login')
    .send({ username: 'admin', password: 'admin123' });

  // Token para futuras peticiones protegidas.
  token = res.body.token;

  // Crear autor para los tests de libro.
  const author = await Author.create(
    { 
      name: 'JORGE LUIS BORGES', 
      birthDate: '1899-08-24' 
    });

  // Id del autor creado.
  authorId = author.id;
});


// Tests para autenticacion.
describe('Autenticación', () => {
  test('Login fallido', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'admin', password: '000000' });
    expect(res.statusCode).toBe(401);
  });

  test('Login exitoso', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'admin', password: 'admin123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});


// Tests para autores.
describe('Autores', () => {
  test('Listar autores', async () => {
    const res = await request(app)
      .get('/autores')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.authors)).toBe(true);
  });

  test('Crear autor valido', async () => {
    const res = await request(app)
      .post('/autores')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Julio Cortázar', birthDate: '1914-08-26' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('JULIO CORTAZAR');
    createdAuthorId = res.body.id;
  });

  test('Crear autor inválido', async () => {
    const res = await request(app)
      .post('/autores')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '', birthDate: '' });
    expect(res.statusCode).toBe(400);
  });

  test('Actualizar autor', async () => {
    const res = await request(app)
      .patch(`/autores/${createdAuthorId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Julio F. Cortázar', birthDate: '1914-08-26' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('JULIO F CORTAZAR');
  });

  test('Eliminar autor', async () => {
    const res = await request(app)
      .delete(`/autores/${createdAuthorId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminado/i);
  });

  test('Eliminar autor inexistente', async () => {
    const res = await request(app)
      .delete(`/autores/${createdAuthorId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});

// Tests para libros.
describe('Libros', () => {
  test('Listar libros (vacío)', async () => {
    const res = await request(app)
      .get('/libros')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.books)).toBe(true);
    expect(res.body.books.length).toBe(0);
  });

  test('Crear libro válido', async () => {
    const res = await request(app)
      .post('/libros')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Ficciones',
        isbn: '9780307474728',
        authorId: authorId,
        pageCount: 200
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('FICCIONES');
    bookId = res.body.id;
  });

  test('Crear libro inválido', async () => {
    const res = await request(app)
      .post('/libros')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '', isbn: '', authorId: '', pageCount: '' });
    expect(res.statusCode).toBe(400);
  });

  test('Obtener libro por id', async () => {
    const res = await request(app)
      .get(`/libros/${bookId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(bookId);
  });

  test('Actualizar libro', async () => {
    const res = await request(app)
      .patch(`/libros/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Ficciones (Edición Revisada)' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('FICCIONES EDICION REVISADA');
  });

  test('Eliminar libro', async () => {
    const res = await request(app)
      .delete(`/libros/${bookId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminado/i);
  });

  test('Eliminar libro inexistente', async () => {
    const res = await request(app)
      .delete(`/libros/${bookId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});

afterAll(async () => {
  await sequelize.close();
});