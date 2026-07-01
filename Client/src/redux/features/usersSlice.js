import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
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

// PUT /api/usuarios/{id} → edición de perfil
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

// PATCH /api/usuarios/{id}/rol → cambia el rol (solo ADMIN)
export const cambiarRol = createAsyncThunk('users/cambiarRol', async ({ id, rol }, { rejectWithValue }) => {
  try {
    return await usuarioService.cambiarRol(id, rol);
  } catch (err) {
    return rejectWithValue(err);
  }
});

// DELETE /api/usuarios/{id} → elimina el usuario. Devuelve el id para filtrar la lista.
export const eliminarUsuario = createAsyncThunk('users/eliminarUsuario', async (id, { rejectWithValue }) => {
  try {
    await usuarioService.eliminarUsuario(id);
    return id;
  } catch (err) {
    return rejectWithValue(err);
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    lista: [],
    actual: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ─── Fulfilled de lecturas ────────────────────────────────────────────────
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.loading = false;
        state.lista = action.payload;
      })
      .addCase(fetchUsuarioActual.fulfilled, (state, action) => {
        state.loading = false;
        state.actual = action.payload;
      })
      // ─── Fulfilled de mutaciones ──────────────────────────────────────────────
      .addCase(actualizarUsuario.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.lista.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.lista[idx] = { ...state.lista[idx], ...action.payload };
        if (state.actual?.id === action.payload.id) state.actual = { ...state.actual, ...action.payload };
      })
      .addCase(cambiarPassword.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(cambiarRol.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.lista.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.lista[idx] = { ...state.lista[idx], ...action.payload };
        if (state.actual?.id === action.payload.id) state.actual = { ...state.actual, ...action.payload };
      })
      .addCase(eliminarUsuario.fulfilled, (state, action) => {
        state.saving = false;
        state.lista = state.lista.filter((u) => u.id !== action.payload);
      })
      // ─── Pending unificado para lecturas ──────────────────────────────────────
      .addMatcher(
        isAnyOf(fetchUsuarios.pending, fetchUsuarioActual.pending),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // ─── Pending unificado para mutaciones ────────────────────────────────────
      .addMatcher(
        isAnyOf(actualizarUsuario.pending, cambiarPassword.pending, cambiarRol.pending, eliminarUsuario.pending),
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )
      // ─── Rejected unificado para lecturas ─────────────────────────────────────
      .addMatcher(
        isAnyOf(fetchUsuarios.rejected, fetchUsuarioActual.rejected),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message ?? 'Error al cargar usuario';
        }
      )
      // ─── Rejected unificado para mutaciones ───────────────────────────────────
      .addMatcher(
        isAnyOf(actualizarUsuario.rejected, cambiarPassword.rejected, cambiarRol.rejected, eliminarUsuario.rejected),
        (state, action) => {
          state.saving = false;
          state.error = action.payload?.message ?? 'Error al modificar usuario';
        }
      );
  },
});

export const selectUsuarios = (state) => state.users.lista;
export const selectUsuarioActual = (state) => state.users.actual;
export const selectUsuariosLoading = (state) => state.users.loading;
export const selectUsuariosSaving = (state) => state.users.saving;
export const selectUsuariosError = (state) => state.users.error;

export default usersSlice.reducer;
