import { apiFetch } from './api';

const SESION_KEY = 'sesion';

// Guarda el token y los datos del usuario que devuelve el backend tras login/registro.
// El backend responde: { access_token: "eyJ...", rol: "CLIENTE", id: 1, email: "..." }
function guardarSesion(data) {
  const sesion = {
    token: data.access_token,
    rol: data.rol,
    id: data.id,
    email: data.email,
  };
  localStorage.setItem('token', sesion.token);
  localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
  return sesion;
}

// Lee la sesión guardada al recargar la página (o null si no hay)
export function getSesionGuardada() {
  const raw = localStorage.getItem(SESION_KEY);
  return raw ? JSON.parse(raw) : null;
}

// POST /api/v1/auth/authenticate  → inicia sesión con un usuario existente
export async function login(email, password) {
  const data = await apiFetch('/api/v1/auth/authenticate', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return guardarSesion(data);
}

// POST /api/v1/auth/register  → crea un usuario nuevo (y ya queda logueado)
export async function register(email, password) {
  const data = await apiFetch('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return guardarSesion(data);
}

// Cierra sesión borrando el token guardado
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem(SESION_KEY);
}
