import { createSlice } from '@reduxjs/toolkit';

const CARRITO_KEY = 'carrito';

function leerCarritoGuardado() {
  const guardado = localStorage.getItem(CARRITO_KEY);
  return guardado ? JSON.parse(guardado) : [];
}

function guardarCarrito(items) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(items));
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: leerCarritoGuardado(),
  },
  reducers: {
    agregarAlCarrito(state, action) {
      const { producto, cantidad = 1 } = action.payload;
      const existente = state.items.find((item) => item.id === producto.id);
      const stock = producto.stock ?? Infinity;
      if (existente) {
        existente.cantidad = Math.min(existente.cantidad + cantidad, stock);
      } else {
        state.items.push({ ...producto, cantidad: Math.min(cantidad, stock) });
      }
      guardarCarrito(state.items);
    },
    eliminarDelCarrito(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      guardarCarrito(state.items);
    },
    actualizarCantidad(state, action) {
      const { id, cantidad } = action.payload;
      if (cantidad <= 0) {
        state.items = state.items.filter((item) => item.id !== id);
        guardarCarrito(state.items);
        return;
      }
      const item = state.items.find((item) => item.id === id);
      if (item) {
        const stock = item.stock ?? Infinity;
        item.cantidad = Math.min(cantidad, stock);
      }
      guardarCarrito(state.items);
    },
    vaciarCarrito(state) {
      state.items = [];
      guardarCarrito(state.items);
    },
  },
});

export const { agregarAlCarrito, eliminarDelCarrito, actualizarCantidad, vaciarCarrito } = cartSlice.actions;

export const selectCarrito = (state) => state.cart.items;
export const selectTotalItems = (state) => state.cart.items.reduce((acc, item) => acc + item.cantidad, 0);
export const selectSubtotal = (state) => state.cart.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

export default cartSlice.reducer;
