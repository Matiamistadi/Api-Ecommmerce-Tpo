import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';

// Thunk: hace el POST contra el backend (vía Axios, dentro de authService) y
// devuelve la sesión { token, rol, id, email } que arma guardarSesion().
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

// Thunk: inicia la recuperación de contraseña (POST /forgot-password).
// No actualiza la sesión; el componente decide qué mostrar (por privacidad, no revela
// si el email existe). Ver rechazo manejado en OlvidePassword.
export const forgotPassword = createAsyncThunk('auth/forgotPassword', async ({ email }, { rejectWithValue }) => {
  try {
    return await authService.forgotPassword(email);
  } catch (err) {
    return rejectWithValue(err);
  }
});

// Thunk: cambia la contraseña con el código recibido por mail (POST /reset-password).
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
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.usuario = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.usuario = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, sesionExpirada } = authSlice.actions;

export const selectUsuario = (state) => state.auth.usuario;
export const selectEstaLogueado = (state) => !!state.auth.usuario;
export const selectEsAdmin = (state) => state.auth.usuario?.rol === 'ADMIN';

export default authSlice.reducer;
