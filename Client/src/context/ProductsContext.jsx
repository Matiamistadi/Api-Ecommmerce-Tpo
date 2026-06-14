import { createContext, useContext, useEffect, useState } from 'react';
import { getProductos } from '../services/productosService';

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

  const agregarProducto = (productoNuevo) => {
    const nuevoProducto = {
      ...productoNuevo,
      id: productoNuevo.id || Math.max(...productos.map((producto) => producto.id), 0) + 1,
      precio: Number(productoNuevo.precio) || 0,
      precioOriginal: productoNuevo.precioOriginal ? Number(productoNuevo.precioOriginal) : null,
      stock: Number(productoNuevo.stock) || 0,
    };

    setProductos((prev) => [nuevoProducto, ...prev]);
    return nuevoProducto;
  };

  const actualizarProducto = (productoActualizado) => {
    setProductos(prev =>
      prev.map(p => p.id === productoActualizado.id ? productoActualizado : p)
    );
  };

  const eliminarProducto = (id) => {
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  const toggleActivo = (id) => {
    setProductos(prev =>
      prev.map(p => p.id === id ? { ...p, activo: p.activo === false ? true : false } : p)
    );
  };

  return (
    <ProductsContext.Provider
      value={{
        productos,
        loading,
        error,
        recargarProductos,
        agregarProducto,
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
