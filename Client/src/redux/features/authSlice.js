import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';
import { loginUser, registerUser, forgotPassword, resetPassword } from './authThunks';

// Los thunks viven en authThunks.js (lógica asíncrona separada del estado).
// Se re-exportan para que los componentes los importen desde el slice.
export * from './authThunks';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    usuario: authService.getSesionGuardada(),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      authService.logout();
      state.usuario = null;
    },
    sesionExpirada(state) {
      state.usuario = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.usuario = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.usuario = action.payload;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      // Estado de carga unificado para todos los thunks de auth
      .addMatcher(
        isAnyOf(loginUser.pending, registerUser.pending, forgotPassword.pending, resetPassword.pending),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // Manejo de error unificado — el estado guarda string para ser serializable
      .addMatcher(
        isAnyOf(loginUser.rejected, registerUser.rejected, forgotPassword.rejected, resetPassword.rejected),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message ?? 'Error de autenticación';
        }
      );
  },
});

export const { logout, sesionExpirada } = authSlice.actions;

export const selectUsuario = (state) => state.auth.usuario;
export const selectEstaLogueado = (state) => !!state.auth.usuario;
export const selectEsAdmin = (state) => state.auth.usuario?.rol === 'ADMIN';
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
