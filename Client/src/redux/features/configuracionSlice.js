import { createSlice } from '@reduxjs/toolkit';
import { fetchConfiguracion, guardarConfiguracion } from './configuracionThunks';

// Los thunks viven en configuracionThunks.js; se re-exportan para los componentes.
export * from './configuracionThunks';

const configuracionSlice = createSlice({
  name: 'configuracion',
  initialState: {
    datos: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfiguracion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConfiguracion.fulfilled, (state, action) => {
        state.loading = false;
        state.datos = action.payload;
      })
      .addCase(fetchConfiguracion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? 'Error al cargar la configuración';
      })
      .addCase(guardarConfiguracion.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(guardarConfiguracion.fulfilled, (state, action) => {
        state.saving = false;
        state.datos = action.payload;
      })
      .addCase(guardarConfiguracion.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message ?? 'Error al guardar la configuración';
      });
  },
});

export const selectConfiguracion = (state) => state.configuracion.datos;
export const selectConfiguracionLoading = (state) => state.configuracion.loading;
export const selectConfiguracionSaving = (state) => state.configuracion.saving;
export const selectConfiguracionError = (state) => state.configuracion.error;

export default configuracionSlice.reducer;
