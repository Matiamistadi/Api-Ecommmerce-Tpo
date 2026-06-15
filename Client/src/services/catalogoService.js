import { apiFetch } from './api';

// Devuelven la lista cruda del backend: [{ id, nombre, descripcion }, ...]
// La usamos para llenar los <select> de los formularios del admin.
export function getCategorias() {
  return apiFetch('/api/categorias');
}

export function getMarcas() {
  return apiFetch('/api/marcas');
}
