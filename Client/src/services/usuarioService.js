import { apiFetch } from './api';

// GET /api/usuarios → todos los usuarios (solo ADMIN)
export function getUsuarios() {
  return apiFetch('/api/usuarios');
}

// PUT /api/usuarios/{id} → actualiza datos del usuario (solo manda lo que pasamos).
// Lo usamos para suspender/reactivar mandando { activo: true/false }.
export function actualizarUsuario(id, datos) {
  return apiFetch(`/api/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}
