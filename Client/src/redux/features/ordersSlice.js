import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as ordenService from '../../services/ordenService';

// GET /api/ordenes/usuario/{usuarioId} → pedidos del usuario logueado (Mi Perfil)
export const fetchOrdenesUsuario = createAsyncThunk(
  'orders/fetchOrdenesUsuario',
  async (usuarioId, { rejectWithValue }) => {
    try {
      return await ordenService.getOrdenesPorUsuario(usuarioId);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// GET /api/ordenes → todas las órdenes (panel admin)
export const fetchTodasLasOrdenes = createAsyncThunk(
  'orders/fetchTodasLasOrdenes',
  async (_, { rejectWithValue }) => {
    try {
      return await ordenService.getTodasLasOrdenes();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// PATCH /api/ordenes/{id}/estado → cambia el estado de un pedido (panel admin)
export const actualizarEstadoOrden = createAsyncThunk(
  'orders/actualizarEstadoOrden',
  async ({ id, estado }, { rejectWithValue }) => {
    try {
      return await ordenService.actualizarEstadoOrden(id, estado);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdenesUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdenesUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrdenesUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTodasLasOrdenes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodasLasOrdenes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodasLasOrdenes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(actualizarEstadoOrden.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(actualizarEstadoOrden.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(actualizarEstadoOrden.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const selectOrdenes = (state) => state.orders.items;
export const selectOrdenesLoading = (state) => state.orders.loading;
export const selectOrdenesSaving = (state) => state.orders.saving;
export const selectOrdenesError = (state) => state.orders.error;

export default ordersSlice.reducer;
