import { apiFetch } from './api';

// Orquesta el flujo de compra del backend (4 pasos encadenados con await):
//   1) crea la dirección de envío
//   2) crea un carrito para el usuario
//   3) agrega cada producto al carrito
//   4) confirma el carrito → esto genera la Orden en la base
// Devuelve la Orden creada.
import { API_URL } from './api';

export async function realizarCheckout({ usuarioId, items, direccion, codigoCupon }) {
  // 1) Crear la dirección de envío del usuario
  const dir = await apiFetch(`/api/usuarios/${usuarioId}/direcciones`, {
    method: 'POST',
    body: JSON.stringify(direccion),
  });

  // 2) Crear un carrito vacío para el usuario
  const carrito = await apiFetch(`/api/carritos/usuario/${usuarioId}`, {
    method: 'POST',
  });

  // 3) Agregar cada ítem. El backend recibe productoId y cantidad como query params.
  //    Lo hacemos en orden, esperando cada uno antes del siguiente.
  for (const item of items) {
    await apiFetch(
      `/api/carritos/${carrito.id}/items?productoId=${item.id}&cantidad=${item.cantidad}`,
      { method: 'POST' }
    );
  }

  // 4) Confirmar el carrito → crea y devuelve la Orden
  const orden = await apiFetch(
    `/api/carritos/${carrito.id}/confirmar?direccionEnvioId=${dir.id}`,
    { method: 'POST' }
  );

  // 5) Si hay cupón, registrar su uso
  if (codigoCupon) {
    try {
      await fetch(`${API_URL}/api/cupones/aplicar?codigo=${encodeURIComponent(codigoCupon)}`, { method: 'POST' });
    } catch {
      // No interrumpimos la compra si falla el registro del cupón
    }
  }

  return orden;
}
