import { createAsyncThunk } from '@reduxjs/toolkit';
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
