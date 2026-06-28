import axiosClient, { API_URL } from './axiosClient';

export { API_URL };

// Devuelve el token guardado (o null si el usuario no inició sesión)
export function getToken() {
  return localStorage.getItem('token');
}

// Wrapper sobre Axios que mantiene la misma firma que usaban los services
// (path, { method, body, headers }) para no tener que tocar cada llamada.
export async function apiFetch(path, options = {}) {
  const { method = 'GET', body, headers } = options;
  const esFormData = body instanceof FormData;

  let data = body;
  if (!esFormData && typeof body === 'string') {
    data = JSON.parse(body);
  }

  const response = await axiosClient.request({
    url: path,
    method,
    data,
    headers: {
      ...(esFormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
  });

  return response.data;
}
