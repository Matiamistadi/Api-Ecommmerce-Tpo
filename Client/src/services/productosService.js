import { apiFetch } from './api';
import { API_URL } from './axiosClient';

// Deriva el "gusto" del producto a partir de su nombre (el backend no guarda un campo sabor)
export function getSabor(nombre = '') {
  const n = nombre.toLowerCase();
  if (n.includes('vainilla')) return 'Vainilla';
  if (n.includes('chocolate')) return 'Chocolate';
  if (n.includes('manzana')) return 'Manzana';
  if (n.includes('sandía') || n.includes('sandia')) return 'Sandía';
  if (n.includes('limón') || n.includes('limon')) return 'Limón';
  if (n.includes('lima')) return 'Lima';
  if (n.includes('ponche')) return 'Ponche';
  if (n.includes('azul')) return 'Frutal';
  if (n.includes('sin sabor')) return 'Sin sabor';
  return 'Otro';
}

function resolverUrlImagen(url) {
  if (!url) return '/img/sin-foto.svg';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

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
    sabor: getSabor(producto.nombre),
    imagenUrl: resolverUrlImagen(producto.imagenes?.[0]?.url),
    imagenDetalleUrl: resolverUrlImagen(producto.imagenes?.[1]?.url ?? producto.imagenes?.[0]?.url),
  };
}

// Traductor INVERSO: del formato plano de React al formato que espera el backend.
// El backend pide categoria/marca como objetos con id. Las imágenes NO van acá:
// se suben aparte como archivo (multipart).
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

// Sube una imagen a un producto usando multipart/form-data (campo "file")
export async function subirImagen(productoId, file) {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch(`/api/productos/${productoId}/imagenes`, {
    method: 'POST',
    body: formData,
  });
}

// Reemplaza la imagen de un producto: borra las que tenía y sube la nueva
export async function reemplazarImagen(productoId, file) {
  const raw = await apiFetch(`/api/productos/${productoId}`);
  for (const img of raw.imagenes || []) {
    await apiFetch(`/api/productos/${productoId}/imagenes/${img.id}`, { method: 'DELETE' });
  }
  await subirImagen(productoId, file);
  return getProductoById(productoId);
}

// Crea el producto (JSON) y, si vienen archivos, los sube y devuelve el producto ya con sus imágenes
export async function crearProducto(producto, archivos = {}) {
  const data = await apiFetch('/api/productos', {
    method: 'POST',
    body: JSON.stringify(toBackend(producto)),
  });

  if (archivos.principal) await subirImagen(data.id, archivos.principal);
  if (archivos.detalle) await subirImagen(data.id, archivos.detalle);

  // Volvemos a traer el producto desde el backend para tener la categoría/marca
  // con su nombre y las imágenes ya asociadas (la respuesta del POST no las trae completas).
  return getProductoById(data.id);
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
