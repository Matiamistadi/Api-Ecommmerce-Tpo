import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getResumenAdmin, METRICS_VACIAS } from '../../services/adminService';

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
