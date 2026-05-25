import { createContext, useContext, useState } from 'react';
import { productos as productosIniciales } from '../data/productos';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [productos, setProductos] = useState(productosIniciales);

  const actualizarProducto = (productoActualizado) => {
    setProductos(prev =>
      prev.map(p => p.id === productoActualizado.id ? productoActualizado : p)
    );
  };

  const eliminarProducto = (id) => {
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProductsContext.Provider value={{ productos, actualizarProducto, eliminarProducto }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
