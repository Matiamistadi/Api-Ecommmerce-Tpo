import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProductos,
  crearProducto,
  reemplazarImagen,
  actualizarProducto as actualizarProductoService,
  eliminarProducto as eliminarProductoService,
  toggleActivoProducto,
} from '../../services/productosService';

// Thunk: trae el catálogo desde el backend (productosService usa Axios por debajo, vía apiFetch).
export const fetchProductos = createAsyncThunk('products/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getProductos();
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const agregarProducto = createAsyncThunk('products/agregar', async ({ productoNuevo, archivos }, { rejectWithValue }) => {
  try {
    return await crearProducto(productoNuevo, archivos);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const reemplazarImagenProducto = createAsyncThunk('products/reemplazarImagen', async ({ id, file }, { rejectWithValue }) => {
  try {
    return await reemplazarImagen(id, file);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const actualizarProducto = createAsyncThunk('products/actualizar', async (productoActualizado, { rejectWithValue }) => {
  try {
    return await actualizarProductoService(productoActualizado.id, productoActualizado);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const eliminarProducto = createAsyncThunk('products/eliminar', async (id, { rejectWithValue }) => {
  try {
    await eliminarProductoService(id);
    return id;
  } catch (err) {
    return rejectWithValue(err);
  }
});

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
    loading: true,
    saving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload;
      })
      .addCase(agregarProducto.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(agregarProducto.fulfilled, (state, action) => {
        state.saving = false;
        state.productos.unshift(action.payload);
      })
      .addCase(agregarProducto.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(reemplazarImagenProducto.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(reemplazarImagenProducto.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.productos.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.productos[idx] = action.payload;
      })
      .addCase(reemplazarImagenProducto.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(actualizarProducto.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(actualizarProducto.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.productos.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.productos[idx] = action.payload;
      })
      .addCase(actualizarProducto.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(eliminarProducto.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(eliminarProducto.fulfilled, (state, action) => {
        state.saving = false;
        state.productos = state.productos.filter((p) => p.id !== action.payload);
      })
      .addCase(eliminarProducto.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(toggleActivo.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(toggleActivo.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.productos.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.productos[idx] = action.payload;
      })
      .addCase(toggleActivo.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const selectProductos = (state) => state.products.productos;
export const selectProductosLoading = (state) => state.products.loading;
export const selectProductosSaving = (state) => state.products.saving;
export const selectProductosError = (state) => state.products.error;

export default productsSlice.reducer;
