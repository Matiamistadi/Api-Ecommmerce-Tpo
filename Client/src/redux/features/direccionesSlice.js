import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  fetchDirecciones,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion,
} from './direccionesThunks';

// Los thunks viven en direccionesThunks.js; se re-exportan para los componentes.
export * from './direccionesThunks';

const direccionesSlice = createSlice({
  name: 'direcciones',
  initialState: {
    items: [],
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ─── Fulfilled de lectura ─────────────────────────────────────────────────
      .addCase(fetchDirecciones.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      // ─── Fulfilled de mutaciones ──────────────────────────────────────────────
      .addCase(crearDireccion.fulfilled, (state, action) => {
        state.saving = false;
        state.items.push(action.payload);
      })
      .addCase(actualizarDireccion.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.items.findIndex((d) => d.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(eliminarDireccion.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.filter((d) => d.id !== action.payload);
      })
      // ─── Pending/Rejected de lectura ──────────────────────────────────────────
      .addMatcher(isAnyOf(fetchDirecciones.pending), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isAnyOf(fetchDirecciones.rejected), (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? 'Error al cargar direcciones';
      })
      // ─── Pending unificado para mutaciones ────────────────────────────────────
      .addMatcher(
        isAnyOf(crearDireccion.pending, actualizarDireccion.pending, eliminarDireccion.pending),
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )
      // ─── Rejected unificado para mutaciones ───────────────────────────────────
      .addMatcher(
        isAnyOf(crearDireccion.rejected, actualizarDireccion.rejected, eliminarDireccion.rejected),
        (state, action) => {
          state.saving = false;
          state.error = action.payload?.message ?? 'Error al modificar dirección';
        }
      );
  },
});

export const selectDirecciones = (state) => state.direcciones.items;
export const selectDireccionesLoading = (state) => state.direcciones.loading;
export const selectDireccionesSaving = (state) => state.direcciones.saving;
export const selectDireccionesError = (state) => state.direcciones.error;

export default direccionesSlice.reducer;
