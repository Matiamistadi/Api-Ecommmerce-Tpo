export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function apiFetch(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verificá que el backend esté corriendo.');
  }

  if (!response.ok) {
    throw new Error(`Error ${response.status} al consultar ${path}`);
  }

  if (response.status === 204) return null;
  return response.json();
}
