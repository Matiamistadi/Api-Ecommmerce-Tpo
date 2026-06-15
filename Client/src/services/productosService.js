import { apiFetch } from './api';

// Traduce el formato del backend (Producto entity) al formato que ya
// consumen los componentes del catálogo (ProductCard, FilterSidebar, etc.)
export function mapProducto(producto) {
  return {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    precioOriginal: producto.precioOriginal ?? null,
    stock: producto.stock,
    activo: producto.activo,
    categoria: producto.categoria?.nombre ?? 'Sin categoría',
    categoriaId: producto.categoria?.id ?? null,
    marca: producto.marca?.nombre ?? '',
    marcaId: producto.marca?.id ?? null,
    imagenUrl: producto.imagenes?.[0]?.url ?? '/img/BannerNexa.png',
    imagenDetalleUrl: producto.imagenes?.[1]?.url ?? producto.imagenes?.[0]?.url,
  };
}

// Traductor INVERSO: del formato plano de React al formato que espera el backend.
// El backend pide categoria/marca como objetos con id, y las imágenes como lista.
function toBackend(producto) {
  return {
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: Number(producto.precio),
    precioOriginal: producto.precioOriginal ? Number(producto.precioOriginal) : null,
    stock: Number(producto.stock),
    activo: producto.activo ?? true,
    categoria: producto.categoriaId ? { id: Number(producto.categoriaId) } : null,
    marca: producto.marcaId ? { id: Number(producto.marcaId) } : null,
    imagenes: [producto.imagenUrl, producto.imagenDetalleUrl]
      .filter(Boolean)
      .map((url) => ({ url })),
  };
}

export async function getProductos() {
  const data = await apiFetch('/api/productos');
  return data.map(mapProducto);
}

export async function getProductoById(id) {
  const data = await apiFetch(`/api/productos/${id}`);
  return mapProducto(data);
}

export async function crearProducto(producto) {
  const data = await apiFetch('/api/productos', {
    method: 'POST',
    body: JSON.stringify(toBackend(producto)),
  });
  return mapProducto(data);
}

export async function actualizarProducto(id, producto) {
  const data = await apiFetch(`/api/productos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(toBackend(producto)),
  });
  return mapProducto(data);
}

export async function eliminarProducto(id) {
  await apiFetch(`/api/productos/${id}`, { method: 'DELETE' });
}

export async function toggleActivoProducto(id) {
  const data = await apiFetch(`/api/productos/${id}/toggle-activo`, { method: 'PATCH' });
  return mapProducto(data);
}
