export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Devuelve el token guardado (o null si el usuario no inició sesión)
export function getToken() {
  return localStorage.getItem('token');
}

export async function apiFetch(path, options = {}) {
  const token = getToken();

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        // Si hay token, lo mandamos en cada pedido para identificarnos
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verificá que el backend esté corriendo.');
  }

  if (!response.ok) {
    // Intentamos leer el mensaje de error que manda el backend en el JSON
    let mensaje = `Error ${response.status} al consultar ${path}`;
    try {
      const errorBody = await response.json();
      mensaje = errorBody.error || errorBody.message || mensaje;
    } catch {
      // La respuesta no traía cuerpo JSON, dejamos el mensaje genérico
    }
    throw new Error(mensaje);
  }

  if (response.status === 204) return null;
  return response.json();
}
