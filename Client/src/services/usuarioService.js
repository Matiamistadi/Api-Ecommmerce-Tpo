import { apiFetch } from './api';

// GET /api/usuarios → todos los usuarios (solo ADMIN)
export function getUsuarios() {
  return apiFetch('/api/usuarios');
}

// GET /api/usuarios/{id} → datos de un usuario (nombre, email, teléfono, etc.)
export function getUsuario(id) {
  return apiFetch(`/api/usuarios/${id}`);
}

// PUT /api/usuarios/{id} → actualiza datos del usuario (solo manda lo que pasamos).
// Lo usamos para suspender/reactivar mandando { activo: true/false }.
export function actualizarUsuario(id, datos) {
  return apiFetch(`/api/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}

// PATCH /api/usuarios/{id}/cambiar-password → cambia contraseña verificando la actual
export function cambiarPassword(id, passwordActual, passwordNueva) {
  return apiFetch(`/api/usuarios/${id}/cambiar-password`, {
    method: 'PATCH',
    body: JSON.stringify({ passwordActual, passwordNueva }),
  });
}
