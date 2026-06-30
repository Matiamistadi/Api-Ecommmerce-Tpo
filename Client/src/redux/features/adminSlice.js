import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getResumenAdmin, METRICS_VACIAS } from '../../services/adminService';
import { cambiarRol, eliminarUsuario } from './usersSlice';

// GET combinado (órdenes + usuarios) que arma estadísticas para el panel admin
export const fetchResumenAdmin = createAsyncThunk('admin/fetchResumen', async (_, { rejectWithValue }) => {
  try {
    return await getResumenAdmin();
  } catch (err) {
    return rejectWithValue(err);
  }
});

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
        state.error = action.payload;
      })
      // La tabla de clientes (admin) se arma a partir de esta lista derivada, así que
      // reflejamos en memoria los cambios de rol/baja sin volver a pedir todo el resumen.
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
