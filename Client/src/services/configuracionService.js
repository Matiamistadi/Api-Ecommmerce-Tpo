import { apiFetch } from './api';

// GET /api/configuracion → configuración de la tienda (público)
export function getConfiguracion() {
  return apiFetch('/api/configuracion');
}

// PUT /api/configuracion → actualiza la configuración (solo ADMIN)
export function actualizarConfiguracion(datos) {
  return apiFetch('/api/configuracion', {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}
