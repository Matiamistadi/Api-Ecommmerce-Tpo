export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Devuelve el token guardado (o null si el usuario no inició sesión)
export function getToken() {
  return localStorage.getItem('token');
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  // Si mandamos un FormData (subida de archivos), NO ponemos Content-Type:
  // el navegador lo arma solo con el boundary correcto del multipart.
  const esFormData = options.body instanceof FormData;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        ...(esFormData ? {} : { 'Content-Type': 'application/json' }),
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
    // 401 = token ausente/vencido → limpiamos la sesión y avisamos a la app
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('sesion');
      window.dispatchEvent(new Event('sesion-expirada'));
    }

    // Intentamos leer el mensaje de error que manda el backend en el JSON
    let mensaje = `Error ${response.status} al consultar ${path}`;
    try {
      const errorBody = await response.json();
      // El backend manda el detalle en "mensaje"; "error" es solo el tipo (ej: "Bad Request")
      mensaje = errorBody.mensaje || errorBody.error || errorBody.message || mensaje;
    } catch {
      // La respuesta no traía cuerpo JSON, dejamos el mensaje genérico
    }
    throw new Error(mensaje);
  }

  if (response.status === 204) return null;
  return response.json();
}
