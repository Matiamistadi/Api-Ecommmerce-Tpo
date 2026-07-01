import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import {
  getProductos,
  crearProducto,
  reemplazarImagen,
  actualizarProducto as actualizarProductoService,
  eliminarProducto as eliminarProductoService,
  toggleActivoProducto,
} from '../../services/productosService';

// GET /api/productos → catálogo completo (público)
export const fetchProductos = createAsyncThunk('products/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getProductos();
  } catch (err) {
    return rejectWithValue(err);
  }
});

// POST /api/productos + subida de imágenes (solo ADMIN)
export const agregarProducto = createAsyncThunk('products/agregar', async ({ productoNuevo, archivos }, { rejectWithValue }) => {
  try {
    return await crearProducto(productoNuevo, archivos);
  } catch (err) {
    return rejectWithValue(err);
  }
});

// DELETE imágenes viejas + POST imagen nueva (solo ADMIN)
export const reemplazarImagenProducto = createAsyncThunk('products/reemplazarImagen', async ({ id, file }, { rejectWithValue }) => {
  try {
    return await reemplazarImagen(id, file);
  } catch (err) {
    return rejectWithValue(err);
  }
});

// PUT /api/productos/{id} (solo ADMIN)
export const actualizarProducto = createAsyncThunk('products/actualizar', async (productoActualizado, { rejectWithValue }) => {
  try {
    return await actualizarProductoService(productoActualizado.id, productoActualizado);
  } catch (err) {
    return rejectWithValue(err);
  }
});

// DELETE /api/productos/{id} → devuelve el id para filtrar el array en estado
export const eliminarProducto = createAsyncThunk('products/eliminar', async (id, { rejectWithValue }) => {
  try {
    await eliminarProductoService(id);
    return id;
  } catch (err) {
    return rejectWithValue(err);
  }
});

// PATCH /api/productos/{id}/toggle-activo (solo ADMIN)
export const toggleActivo = createAsyncThunk('products/toggleActivo', async (id, { rejectWithValue }) => {
  try {
    return await toggleActivoProducto(id);
  } catch (err) {
    return rejectWithValue(err);
  }
});

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
