import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    return await authService.login(email, password);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const registerUser = createAsyncThunk('auth/register', async ({ email, password, nombre }, { rejectWithValue }) => {
  try {
    return await authService.register(email, password, nombre);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async ({ email }, { rejectWithValue }) => {
  try {
    return await authService.forgotPassword(email);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, nuevaPassword }, { rejectWithValue }) => {
  try {
    return await authService.resetPassword(token, nuevaPassword);
  } catch (err) {
    return rejectWithValue(err);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    usuario: authService.getSesionGuardada(),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      authService.logout();
      state.usuario = null;
    },
    sesionExpirada(state) {
      state.usuario = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.usuario = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.usuario = action.payload;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      // Estado de carga unificado para todos los thunks de auth
      .addMatcher(
        isAnyOf(loginUser.pending, registerUser.pending, forgotPassword.pending, resetPassword.pending),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // Manejo de error unificado — el estado guarda string para ser serializable
      .addMatcher(
        isAnyOf(loginUser.rejected, registerUser.rejected, forgotPassword.rejected, resetPassword.rejected),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message ?? 'Error de autenticación';
        }
      );
  },
});

export const { logout, sesionExpirada } = authSlice.actions;

export const selectUsuario = (state) => state.auth.usuario;
export const selectEstaLogueado = (state) => !!state.auth.usuario;
export const selectEsAdmin = (state) => state.auth.usuario?.rol === 'ADMIN';
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
