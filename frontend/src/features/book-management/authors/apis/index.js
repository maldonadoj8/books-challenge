/*- Imports -*/
// Libreria Axios.
import axios from 'axios';

// URL servidor.
const API_URL = 'http://localhost:3000';

// APIs.
export const getAuthors = (token, page = 1, limit = 10) =>
  axios.get(`${API_URL}/autores`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, limit }
  });

export const createAuthor = (author, token) =>
  axios.post(`${API_URL}/autores`, author, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateAuthor = (id, author, token) =>
  axios.patch(`${API_URL}/autores/${id}`, author, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteAuthor = (id, token) =>
  axios.delete(`${API_URL}/autores/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
