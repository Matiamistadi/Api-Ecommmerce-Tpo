import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito(prev => {
      const existente = prev.find(item => item.id === producto.id);
      // No dejamos superar el stock disponible del producto
      const stock = producto.stock ?? Infinity;
      if (existente) {
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: Math.min(item.cantidad + cantidad, stock) }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: Math.min(cantidad, stock) }];
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
      prev.map(item => {
        if (item.id !== id) return item;
        // Tope: no superar el stock guardado del producto
        const stock = item.stock ?? Infinity;
        return { ...item, cantidad: Math.min(cantidad, stock) };
      })
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
