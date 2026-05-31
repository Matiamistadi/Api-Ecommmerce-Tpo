import { createContext, useContext, useState } from 'react';
import { productos as productosIniciales } from '../data/productos';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [productos, setProductos] = useState(productosIniciales);

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

  return (
    <ProductsContext.Provider value={{ productos, agregarProducto, actualizarProducto, eliminarProducto }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
