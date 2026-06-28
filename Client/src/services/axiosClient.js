import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const axiosClient = axios.create({
  baseURL: API_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error('No se pudo conectar con el servidor. Verificá que el backend esté corriendo.'));
    }

    if (error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('sesion');
      window.dispatchEvent(new Event('sesion-expirada'));
    }

    const body = error.response.data;
    const mensaje = body?.mensaje || body?.error || body?.message || `Error ${error.response.status} al consultar ${error.config?.url}`;
    return Promise.reject(new Error(mensaje));
  }
);

export default axiosClient;
