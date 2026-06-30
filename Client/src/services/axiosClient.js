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
    // Sin respuesta del servidor = fallo de red real. Marcamos el error con
    // esRedCaida para que los componentes puedan distinguirlo de un error HTTP.
    if (!error.response) {
      const err = new Error('No se pudo conectar con el servidor. Verificá que el backend esté corriendo.');
      err.esRedCaida = true;
      return Promise.reject(err);
    }

    const { status } = error.response;

    // 401: token vencido/ inválido → limpiamos la sesión y avisamos al store
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('sesion');
      window.dispatchEvent(new Event('sesion-expirada'));
    }

    // 403: autenticado pero sin permisos (ej: cliente intentando acción de admin)
    if (status === 403) {
      return Promise.reject(new Error('No tenés permisos para realizar esta acción.'));
    }

    // 500: error interno del backend
    if (status === 500) {
      return Promise.reject(new Error('Error del servidor, intentá más tarde.'));
    }

    const body = error.response.data;
    const mensaje = body?.mensaje || body?.error || body?.message || `Error ${status} al consultar ${error.config?.url}`;
    return Promise.reject(new Error(mensaje));
  }
);

export default axiosClient;
