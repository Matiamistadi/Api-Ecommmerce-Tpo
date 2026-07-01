import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import * as direccionService from '../../services/direccionService';

// GET /api/usuarios/{usuarioId}/direcciones
export const fetchDirecciones = createAsyncThunk('direcciones/fetch', async (usuarioId, { rejectWithValue }) => {
  try {
    return await direccionService.getDirecciones(usuarioId);
  } catch (err) {
    return rejectWithValue(err);
  }
});

// POST /api/usuarios/{usuarioId}/direcciones
export const crearDireccion = createAsyncThunk(
  'direcciones/crear',
  async ({ usuarioId, direccion }, { rejectWithValue }) => {
    try {
      return await direccionService.crearDireccion(usuarioId, direccion);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// PUT /api/usuarios/{usuarioId}/direcciones/{direccionId}
export const actualizarDireccion = createAsyncThunk(
  'direcciones/actualizar',
  async ({ usuarioId, direccionId, direccion }, { rejectWithValue }) => {
    try {
      return await direccionService.actualizarDireccion(usuarioId, direccionId, direccion);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// DELETE /api/usuarios/{usuarioId}/direcciones/{direccionId} → devuelve el id para filtrar
export const eliminarDireccion = createAsyncThunk(
  'direcciones/eliminar',
  async ({ usuarioId, direccionId }, { rejectWithValue }) => {
    try {
      await direccionService.eliminarDireccion(usuarioId, direccionId);
      return direccionId;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

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
