import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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

// DELETE /api/usuarios/{usuarioId}/direcciones/{direccionId}
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
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDirecciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDirecciones.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDirecciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(crearDireccion.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(crearDireccion.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(eliminarDireccion.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => d.id !== action.payload);
      })
      .addCase(eliminarDireccion.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const selectDirecciones = (state) => state.direcciones.items;
export const selectDireccionesLoading = (state) => state.direcciones.loading;
export const selectDireccionesError = (state) => state.direcciones.error;

export default direccionesSlice.reducer;
