import { apiFetch } from './api';

// Trae las direcciones guardadas del usuario: [{ id, calle, ciudad, provincia, codigoPostal, esPrincipal }]
export function getDirecciones(usuarioId) {
  return apiFetch(`/api/usuarios/${usuarioId}/direcciones`);
}
