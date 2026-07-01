import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
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

// DELETE /api/ordenes/{id} → elimina un pedido (panel admin). Devuelve el id para filtrar.
export const eliminarOrden = createAsyncThunk(
  'orders/eliminarOrden',
  async (id, { rejectWithValue }) => {
    try {
      await ordenService.eliminarOrden(id);
      return id;
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
      // ─── Fulfilled de lecturas ────────────────────────────────────────────────
      .addCase(fetchOrdenesUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodasLasOrdenes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      // ─── Fulfilled de mutaciones ──────────────────────────────────────────────
      .addCase(actualizarEstadoOrden.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.items.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(eliminarOrden.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.filter((o) => o.id !== action.payload);
      })
      // ─── Pending unificado para lecturas ──────────────────────────────────────
      .addMatcher(
        isAnyOf(fetchOrdenesUsuario.pending, fetchTodasLasOrdenes.pending),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // ─── Pending unificado para mutaciones ────────────────────────────────────
      .addMatcher(
        isAnyOf(actualizarEstadoOrden.pending, eliminarOrden.pending),
        (state) => {
          state.saving = true;
        }
      )
      // ─── Rejected unificado para lecturas ─────────────────────────────────────
      .addMatcher(
        isAnyOf(fetchOrdenesUsuario.rejected, fetchTodasLasOrdenes.rejected),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message ?? 'Error al cargar pedidos';
        }
      )
      // Los errores de mutaciones se muestran por toast en el componente;
      // no se escribe state.error para no ocultar la tabla con un cartel de error.
      .addMatcher(
        isAnyOf(actualizarEstadoOrden.rejected, eliminarOrden.rejected),
        (state) => {
          state.saving = false;
        }
      );
  },
});

export const selectOrdenes = (state) => state.orders.items;
export const selectOrdenesLoading = (state) => state.orders.loading;
export const selectOrdenesSaving = (state) => state.orders.saving;
export const selectOrdenesError = (state) => state.orders.error;

export default ordersSlice.reducer;
