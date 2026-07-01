import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  fetchUsuarios,
  fetchUsuarioActual,
  actualizarUsuario,
  cambiarPassword,
  cambiarRol,
  eliminarUsuario,
} from './usersThunks';

// Los thunks viven en usersThunks.js; se re-exportan para los componentes.
export * from './usersThunks';

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    lista: [],
    actual: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ─── Fulfilled de lecturas ────────────────────────────────────────────────
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.loading = false;
        state.lista = action.payload;
      })
      .addCase(fetchUsuarioActual.fulfilled, (state, action) => {
        state.loading = false;
        state.actual = action.payload;
      })
      // ─── Fulfilled de mutaciones ──────────────────────────────────────────────
      .addCase(actualizarUsuario.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.lista.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.lista[idx] = { ...state.lista[idx], ...action.payload };
        if (state.actual?.id === action.payload.id) state.actual = { ...state.actual, ...action.payload };
      })
      .addCase(cambiarPassword.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(cambiarRol.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.lista.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.lista[idx] = { ...state.lista[idx], ...action.payload };
        if (state.actual?.id === action.payload.id) state.actual = { ...state.actual, ...action.payload };
      })
      .addCase(eliminarUsuario.fulfilled, (state, action) => {
        state.saving = false;
        state.lista = state.lista.filter((u) => u.id !== action.payload);
      })
      // ─── Pending unificado para lecturas ──────────────────────────────────────
      .addMatcher(
        isAnyOf(fetchUsuarios.pending, fetchUsuarioActual.pending),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // ─── Pending unificado para mutaciones ────────────────────────────────────
      .addMatcher(
        isAnyOf(actualizarUsuario.pending, cambiarPassword.pending, cambiarRol.pending, eliminarUsuario.pending),
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )
      // ─── Rejected unificado para lecturas ─────────────────────────────────────
      .addMatcher(
        isAnyOf(fetchUsuarios.rejected, fetchUsuarioActual.rejected),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message ?? 'Error al cargar usuario';
        }
      )
      // ─── Rejected unificado para mutaciones ───────────────────────────────────
      .addMatcher(
        isAnyOf(actualizarUsuario.rejected, cambiarPassword.rejected, cambiarRol.rejected, eliminarUsuario.rejected),
        (state, action) => {
          state.saving = false;
          state.error = action.payload?.message ?? 'Error al modificar usuario';
        }
      );
  },
});

export const selectUsuarios = (state) => state.users.lista;
export const selectUsuarioActual = (state) => state.users.actual;
export const selectUsuariosLoading = (state) => state.users.loading;
export const selectUsuariosSaving = (state) => state.users.saving;
export const selectUsuariosError = (state) => state.users.error;

export default usersSlice.reducer;
