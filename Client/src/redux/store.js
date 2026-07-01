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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Los thunks pasan el Error completo en rejectWithValue para que
        // .unwrap() lo propague con .message en los catch de los componentes.
        // El estado SIEMPRE guarda solo el string (action.payload.message),
        // así que únicamente necesitamos ignorar la acción, no el estado.
        ignoredActionPaths: ['payload'],
      },
    }),
});

// Si axiosClient detecta un 401, despacha este evento para limpiar la sesión en el store.
window.addEventListener('sesion-expirada', () => store.dispatch(sesionExpirada()));

export default store;
