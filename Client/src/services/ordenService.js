import { apiFetch } from './api';

// Traduce una Orden del backend a un formato cómodo para mostrar en el perfil
export function mapOrden(orden) {
  const items = orden.items || [];
  const total = items.reduce((acc, it) => acc + it.precioUnitario * it.cantidad, 0);
  const cantidadItems = items.reduce((acc, it) => acc + it.cantidad, 0);
  const primerItem = items[0];

  return {
    id: orden.id,
    numero: `#${orden.id}`,
    fecha: orden.fechaCreacion
      ? new Date(orden.fechaCreacion).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
      : '',
    estado: orden.estado,
    total,
    cantidadItems,
    productoNombre: primerItem?.producto?.nombre ?? 'Productos',
    descripcion: cantidadItems === 1 ? '1 producto' : `${cantidadItems} productos`,
    imagen: primerItem?.producto?.imagenes?.[0]?.url ?? '/img/sin-foto.svg',
  };
}

// GET /api/ordenes/usuario/{id} → lista de órdenes del usuario (ya mapeadas)
export async function getOrdenesPorUsuario(usuarioId) {
  const data = await apiFetch(`/api/ordenes/usuario/${usuarioId}`);
  return data.map(mapOrden);
}

// Traduce una Orden al formato que necesita el panel admin (con cliente, dirección, etc.)
export function mapOrdenAdmin(orden) {
  const items = orden.items || [];
  const total = items.reduce((acc, it) => acc + it.precioUnitario * it.cantidad, 0);
  const cantidadProductos = items.reduce((acc, it) => acc + it.cantidad, 0);
  const dir = orden.direccionEnvio;

  return {
    id: orden.id,
    cliente: dir?.nombre || orden.usuario?.email || 'Cliente',
    email: orden.usuario?.email || '',
    fecha: orden.fechaCreacion
      ? new Date(orden.fechaCreacion).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
      : '',
    fechaRaw: orden.fechaCreacion || null,
    estado: orden.estado,
    total,
    cantidadProductos,
    items: items.map((it) => ({
      nombre: it.producto?.nombre ?? 'Producto',
      cantidad: it.cantidad,
      precio: it.precioUnitario,
    })),
    direccion: dir ? `${dir.calle}, ${dir.ciudad}${dir.codigoPostal ? ` (CP ${dir.codigoPostal})` : ''}` : null,
  };
}

// GET /api/ordenes → todas las órdenes (solo ADMIN)
export async function getTodasLasOrdenes() {
  const data = await apiFetch('/api/ordenes');
  return data.map(mapOrdenAdmin);
}

// PATCH /api/ordenes/{id}/estado → cambia el estado (solo ADMIN)
export async function actualizarEstadoOrden(id, estado) {
  const data = await apiFetch(`/api/ordenes/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado }),
  });
  return mapOrdenAdmin(data);
}

// DELETE /api/ordenes/{id} → elimina la orden, sus items y el pago (solo ADMIN)
export function eliminarOrden(id) {
  return apiFetch(`/api/ordenes/${id}`, { method: 'DELETE' });
}
