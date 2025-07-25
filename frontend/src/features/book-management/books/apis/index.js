/*- Imports -*/
// Libreria Axios.
import axios from 'axios';

// URL servidor.
const API_URL = 'http://localhost:3000';

// APIs.
export const getBooks = (params, token) =>
  axios.get(`${API_URL}/libros`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  });

export const getBookById = (id, token) =>
  axios.get(`${API_URL}/libros/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const createBook = (book, token) =>
  axios.post(`${API_URL}/libros`, book, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateBook = (id, book, token) =>
  axios.patch(`${API_URL}/libros/${id}`, book, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteBook = (id, token) =>
  axios.delete(`${API_URL}/libros/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const validateIsbn = (isbn) =>
  axios.get(`${API_URL}/libros/validacion/${isbn}`);

export const uploadBooksCsv = (formData, token) =>
  axios.post(`${API_URL}/libros/masivo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  });