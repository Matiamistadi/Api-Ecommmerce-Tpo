import { apiFetch } from './api';

// Trae las direcciones guardadas del usuario: [{ id, calle, ciudad, provincia, codigoPostal, esPrincipal }]
export function getDirecciones(usuarioId) {
  return apiFetch(`/api/usuarios/${usuarioId}/direcciones`);
}

// Crea una nueva dirección para el usuario
export function crearDireccion(usuarioId, direccion) {
  return apiFetch(`/api/usuarios/${usuarioId}/direcciones`, {
    method: 'POST',
    body: JSON.stringify(direccion),
  });
}

// PUT /api/usuarios/{usuarioId}/direcciones/{direccionId} → actualiza una dirección existente
export function actualizarDireccion(usuarioId, direccionId, direccion) {
  return apiFetch(`/api/usuarios/${usuarioId}/direcciones/${direccionId}`, {
    method: 'PUT',
    body: JSON.stringify(direccion),
  });
}

// Elimina una dirección del usuario
export function eliminarDireccion(usuarioId, direccionId) {
  return apiFetch(`/api/usuarios/${usuarioId}/direcciones/${direccionId}`, { method: 'DELETE' });
}
