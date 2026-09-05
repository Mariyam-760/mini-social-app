import axios from 'axios';

// In local dev, '/api' is proxied to the backend by vite.config.js.
// In production (e.g. frontend on Vercel, backend on Render), there is no
// proxy, so VITE_API_URL must be set to the deployed backend's full URL,
// e.g. https://your-backend.onrender.com/api
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
