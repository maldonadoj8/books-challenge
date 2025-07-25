/*- Imports -*/
// Libreria Axios.
import axios from 'axios';

// URL servidor.
const API_URL = 'http://localhost:3000';

// APIs.
export const login = (credentials) =>
  axios.post(`${API_URL}/login`, credentials);