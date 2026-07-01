import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  fetchProductos,
  agregarProducto,
  reemplazarImagenProducto,
  actualizarProducto,
  eliminarProducto,
  toggleActivo,
} from './productsThunks';

// Los thunks viven en productsThunks.js; se re-exportan para los componentes.
export * from './productsThunks';

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    productos: [],
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ─── Fetch catálogo ───────────────────────────────────────────────────────
      .addCase(fetchProductos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductos.fulfilled, (state, action) => {
        state.loading = false;
        state.productos = action.payload;
      })
      .addCase(fetchProductos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? 'Error al cargar productos';
      })
      // ─── Fulfilled de mutaciones ──────────────────────────────────────────────
      .addCase(agregarProducto.fulfilled, (state, action) => {
        state.saving = false;
        state.productos.unshift(action.payload);
      })
      .addCase(reemplazarImagenProducto.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.productos.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.productos[idx] = action.payload;
      })
      .addCase(actualizarProducto.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.productos.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.productos[idx] = action.payload;
      })
      .addCase(eliminarProducto.fulfilled, (state, action) => {
        state.saving = false;
        state.productos = state.productos.filter((p) => p.id !== action.payload);
      })
      .addCase(toggleActivo.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.productos.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.productos[idx] = action.payload;
      })
      // ─── Pending unificado para todas las mutaciones ──────────────────────────
      .addMatcher(
        isAnyOf(
          agregarProducto.pending,
          reemplazarImagenProducto.pending,
          actualizarProducto.pending,
          eliminarProducto.pending,
          toggleActivo.pending
        ),
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )
      // ─── Rejected unificado para todas las mutaciones ─────────────────────────
      .addMatcher(
        isAnyOf(
          agregarProducto.rejected,
          reemplazarImagenProducto.rejected,
          actualizarProducto.rejected,
          eliminarProducto.rejected,
          toggleActivo.rejected
        ),
        (state, action) => {
          state.saving = false;
          state.error = action.payload?.message ?? 'Error al modificar producto';
        }
      );
  },
});

export const selectProductos = (state) => state.products.productos;
export const selectProductosLoading = (state) => state.products.loading;
export const selectProductosSaving = (state) => state.products.saving;
export const selectProductosError = (state) => state.products.error;

export default productsSlice.reducer;
