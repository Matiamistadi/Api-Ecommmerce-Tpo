import { configureStore } from '@reduxjs/toolkit';
import authReducer, { sesionExpirada } from './features/authSlice';
import cartReducer from './features/cartSlice';
import productsReducer from './features/productsSlice';
import usersReducer from './features/usersSlice';
import direccionesReducer from './features/direccionesSlice';
import ordersReducer from './features/ordersSlice';
import adminReducer from './features/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    users: usersReducer,
    direcciones: direccionesReducer,
    orders: ordersReducer,
    admin: adminReducer,
  },
  // Los thunks rechazan con instancias de Error (para conservar err.message en los
  // catch de los componentes), por eso se excluyen del chequeo de serializabilidad.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ['payload'],
        ignoredPaths: ['auth.error', 'products.error', 'users.error', 'direcciones.error', 'orders.error', 'admin.error'],
      },
    }),
});

// Si una petición detecta el token vencido (401, disparado desde axiosClient),
// despachamos el logout para limpiar el estado global de auth.
window.addEventListener('sesion-expirada', () => store.dispatch(sesionExpirada()));

export default store;
