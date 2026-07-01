import { createAsyncThunk } from '@reduxjs/toolkit';
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
