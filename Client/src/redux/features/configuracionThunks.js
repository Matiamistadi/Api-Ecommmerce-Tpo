import { createAsyncThunk } from '@reduxjs/toolkit';
import { getConfiguracion, actualizarConfiguracion } from '../../services/configuracionService';

// GET /api/configuracion → configuración pública de la tienda
export const fetchConfiguracion = createAsyncThunk('configuracion/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getConfiguracion();
  } catch (err) {
    return rejectWithValue(err);
  }
});

// PUT /api/configuracion → actualiza la configuración (solo ADMIN)
export const guardarConfiguracion = createAsyncThunk('configuracion/guardar', async (datos, { rejectWithValue }) => {
  try {
    return await actualizarConfiguracion(datos);
  } catch (err) {
    return rejectWithValue(err);
  }
});
