import { createContext, useContext, useEffect, useState } from 'react';
import {
  getProductos,
  crearProducto,
  reemplazarImagen,
  actualizarProducto as actualizarProductoService,
  eliminarProducto as eliminarProductoService,
  toggleActivoProducto,
} from '../services/productosService';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductos = () => {
    getProductos()
      .then((data) => {
        setProductos(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const recargarProductos = () => {
    setLoading(true);
    setError(null);
    fetchProductos();
  };

  // Crea el producto en el backend (POST) + sube las imágenes (multipart) y lo agrega al estado
  const agregarProducto = async (productoNuevo, archivos) => {
    const creado = await crearProducto(productoNuevo, archivos);
    setProductos((prev) => [creado, ...prev]);
    return creado;
  };

  // Reemplaza la imagen de un producto existente (para edición) y refresca su fila en el estado
  const reemplazarImagenProducto = async (id, file) => {
    const actualizado = await reemplazarImagen(id, file);
    setProductos((prev) => prev.map((p) => (p.id === id ? actualizado : p)));
    return actualizado;
  };

  // Actualiza el producto en el backend (PUT) y refresca el estado con la respuesta
  const actualizarProducto = async (productoActualizado) => {
    const actualizado = await actualizarProductoService(productoActualizado.id, productoActualizado);
    setProductos((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)));
    return actualizado;
  };

  // Borra el producto en el backend (DELETE) y recién ahí lo saca del estado
  const eliminarProducto = async (id) => {
    await eliminarProductoService(id);
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  // Activa/desactiva en el backend (PATCH) y actualiza con la respuesta
  const toggleActivo = async (id) => {
    const actualizado = await toggleActivoProducto(id);
    setProductos((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)));
  };

  return (
    <ProductsContext.Provider
      value={{
        productos,
        loading,
        error,
        recargarProductos,
        agregarProducto,
        reemplazarImagenProducto,
        actualizarProducto,
        eliminarProducto,
        toggleActivo,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
