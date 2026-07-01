import { createAsyncThunk } from '@reduxjs/toolkit';
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
