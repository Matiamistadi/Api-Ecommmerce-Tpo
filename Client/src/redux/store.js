import { configureStore } from '@reduxjs/toolkit';
import authReducer, { sesionExpirada } from './features/authSlice';
import cartReducer from './features/cartSlice';
import productsReducer from './features/productsSlice';
import usersReducer from './features/usersSlice';
import direccionesReducer from './features/direccionesSlice';
import ordersReducer from './features/ordersSlice';
import adminReducer from './features/adminSlice';
import catalogoReducer from './features/catalogoSlice';
import configuracionReducer from './features/configuracionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    users: usersReducer,
    direcciones: direccionesReducer,
    orders: ordersReducer,
    admin: adminReducer,
    catalogo: catalogoReducer,
    configuracion: configuracionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ['payload'],
      },
    }),
});

window.addEventListener('sesion-expirada', () => store.dispatch(sesionExpirada()));

export default store;
