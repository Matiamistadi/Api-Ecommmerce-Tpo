import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCategorias, getMarcas } from '../../services/catalogoService';

// GET /api/categorias → catálogo de categorías (para <select> del admin)
export const fetchCategorias = createAsyncThunk('catalogo/fetchCategorias', async (_, { rejectWithValue }) => {
  try {
    return await getCategorias();
  } catch (err) {
    return rejectWithValue(err);
  }
});

// GET /api/marcas → catálogo de marcas (para <select> del admin)
export const fetchMarcas = createAsyncThunk('catalogo/fetchMarcas', async (_, { rejectWithValue }) => {
  try {
    return await getMarcas();
  } catch (err) {
    return rejectWithValue(err);
  }
});
