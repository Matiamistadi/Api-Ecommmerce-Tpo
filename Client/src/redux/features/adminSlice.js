import { createSlice } from '@reduxjs/toolkit';
import { METRICS_VACIAS } from '../../services/adminService';
import { fetchResumenAdmin } from './adminThunks';
import { cambiarRol, eliminarUsuario } from './usersThunks';

// El thunk vive en adminThunks.js; se re-exporta para los componentes.
export * from './adminThunks';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    pedidos: [],
    clientes: [],
    metrics: METRICS_VACIAS,
    ventasMensuales: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumenAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumenAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.pedidos = action.payload.pedidos;
        state.clientes = action.payload.clientes;
        state.metrics = action.payload.metrics;
        state.ventasMensuales = action.payload.ventasMensuales;
      })
      .addCase(fetchResumenAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? 'Error al cargar datos del panel';
      })
      // Refleja en memoria los cambios de rol/baja sin volver a pedir todo el resumen
      .addCase(cambiarRol.fulfilled, (state, action) => {
        const idx = state.clientes.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.clientes[idx] = { ...state.clientes[idx], rol: action.payload.rol };
      })
      .addCase(eliminarUsuario.fulfilled, (state, action) => {
        state.clientes = state.clientes.filter((c) => c.id !== action.payload);
      });
  },
});

export const selectAdminPedidos = (state) => state.admin.pedidos;
export const selectAdminClientes = (state) => state.admin.clientes;
export const selectAdminMetrics = (state) => state.admin.metrics;
export const selectAdminVentasMensuales = (state) => state.admin.ventasMensuales;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;

export default adminSlice.reducer;
