import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito(prev => {
      const existente = prev.find(item => item.id === producto.id);
      if (existente) {
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prev, { ...producto, cantidad }];
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  const actualizarCantidad = (id, cantidad) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }
    setCarrito(prev =>
      prev.map(item => item.id === id ? { ...item, cantidad } : item)
    );
  };

  const vaciarCarrito = () => setCarrito([]);

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <CartContext.Provider value={{
      carrito,
      agregarAlCarrito,
      eliminarDelCarrito,
      actualizarCantidad,
      vaciarCarrito,
      totalItems,
      subtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
