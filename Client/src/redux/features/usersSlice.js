import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as usuarioService from '../../services/usuarioService';

// GET /api/usuarios → listado completo (panel admin)
export const fetchUsuarios = createAsyncThunk('users/fetchUsuarios', async (_, { rejectWithValue }) => {
  try {
    return await usuarioService.getUsuarios();
  } catch (err) {
    return rejectWithValue(err);
  }
});

// GET /api/usuarios/{id} → datos del usuario logueado (perfil)
export const fetchUsuarioActual = createAsyncThunk('users/fetchUsuarioActual', async (id, { rejectWithValue }) => {
  try {
    return await usuarioService.getUsuario(id);
  } catch (err) {
    return rejectWithValue(err);
  }
});

// PUT /api/usuarios/{id} → edición de perfil, cambio de password o suspender/reactivar (según lo que se mande)
export const actualizarUsuario = createAsyncThunk('users/actualizarUsuario', async ({ id, datos }, { rejectWithValue }) => {
  try {
    const actualizado = await usuarioService.actualizarUsuario(id, datos);
    return { id, ...actualizado };
  } catch (err) {
    return rejectWithValue(err);
  }
});

// PATCH /api/usuarios/{id}/cambiar-password
export const cambiarPassword = createAsyncThunk(
  'users/cambiarPassword',
  async ({ id, passwordActual, passwordNueva }, { rejectWithValue }) => {
    try {
      await usuarioService.cambiarPassword(id, passwordActual, passwordNueva);
      return true;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    lista: [],
    actual: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.loading = false;
        state.lista = action.payload;
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUsuarioActual.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuarioActual.fulfilled, (state, action) => {
        state.loading = false;
        state.actual = action.payload;
      })
      .addCase(fetchUsuarioActual.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(actualizarUsuario.fulfilled, (state, action) => {
        const idx = state.lista.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.lista[idx] = { ...state.lista[idx], ...action.payload };
        if (state.actual?.id === action.payload.id) state.actual = { ...state.actual, ...action.payload };
      })
      .addCase(actualizarUsuario.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(cambiarPassword.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const selectUsuarios = (state) => state.users.lista;
export const selectUsuarioActual = (state) => state.users.actual;
export const selectUsuariosLoading = (state) => state.users.loading;
export const selectUsuariosError = (state) => state.users.error;

export default usersSlice.reducer;
