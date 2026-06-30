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

// Decodifica el JWT y dice si ya venció (lee el claim "exp")
function tokenVencido(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return !payload.exp || payload.exp * 1000 < Date.now();
  } catch {
    return true; // si no se puede leer, lo tratamos como inválido
  }
}

// Lee la sesión guardada al recargar la página.
// Si el token venció, la limpia y devuelve null (así no quedás en un estado roto).
export function getSesionGuardada() {
  const raw = localStorage.getItem(SESION_KEY);
  if (!raw) return null;
  const sesion = JSON.parse(raw);
  if (!sesion.token || tokenVencido(sesion.token)) {
    logout();
    return null;
  }
  return sesion;
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
export async function register(email, password, nombre) {
  const data = await apiFetch('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, nombre }),
  });
  return guardarSesion(data);
}

// Cierra sesión borrando el token guardado
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem(SESION_KEY);
}

// POST /api/v1/auth/forgot-password  → inicia la recuperación (el backend responde 204
// exista o no el email, para no revelar qué cuentas están registradas)
export async function forgotPassword(email) {
  await apiFetch('/api/v1/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// POST /api/v1/auth/reset-password  → cambia la contraseña usando el código recibido por mail
export async function resetPassword(token, nuevaPassword) {
  await apiFetch('/api/v1/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, nuevaPassword }),
  });
}
