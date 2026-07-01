import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { fetchCategorias, fetchMarcas } from './catalogoThunks';

// Los thunks viven en catalogoThunks.js; se re-exportan para los componentes.
export * from './catalogoThunks';

const catalogoSlice = createSlice({
  name: 'catalogo',
  initialState: {
    categorias: [],
    marcas: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorias.fulfilled, (state, action) => {
        state.categorias = action.payload;
      })
      .addCase(fetchMarcas.fulfilled, (state, action) => {
        state.marcas = action.payload;
      })
      .addMatcher(isAnyOf(fetchCategorias.pending, fetchMarcas.pending), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isAnyOf(fetchCategorias.fulfilled, fetchMarcas.fulfilled), (state) => {
        state.loading = false;
      })
      .addMatcher(isAnyOf(fetchCategorias.rejected, fetchMarcas.rejected), (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? 'Error al cargar categorías/marcas';
      });
  },
});

export const selectCategorias = (state) => state.catalogo.categorias;
export const selectMarcas = (state) => state.catalogo.marcas;
export const selectCatalogoLoading = (state) => state.catalogo.loading;
export const selectCatalogoError = (state) => state.catalogo.error;

export default catalogoSlice.reducer;
