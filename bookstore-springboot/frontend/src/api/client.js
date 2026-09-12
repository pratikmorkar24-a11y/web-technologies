import axios from 'axios';

// The Spring Boot backend runs on :8080; the React dev server runs on :3000.
// withCredentials is required so the JSESSIONID auth cookie is sent/received cross-origin.
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export default api;
export { API_BASE };
