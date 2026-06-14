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
    marca: producto.marca?.nombre ?? '',
    imagenUrl: producto.imagenes?.[0]?.url ?? '/img/BannerNexa.png',
    imagenDetalleUrl: producto.imagenes?.[1]?.url ?? producto.imagenes?.[0]?.url,
  };
}

export async function getProductos() {
  const data = await apiFetch('/api/productos');
  return data.map(mapProducto);
}
