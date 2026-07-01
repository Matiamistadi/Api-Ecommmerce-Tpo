import { createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';

// POST /api/v1/auth/authenticate → login
export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    return await authService.login(email, password);
  } catch (err) {
    return rejectWithValue(err);
  }
});

// POST /api/v1/auth/register → registro (queda logueado)
export const registerUser = createAsyncThunk('auth/register', async ({ email, password, nombre }, { rejectWithValue }) => {
  try {
    return await authService.register(email, password, nombre);
  } catch (err) {
    return rejectWithValue(err);
  }
});

// POST /api/v1/auth/forgot-password → inicia recuperación
export const forgotPassword = createAsyncThunk('auth/forgotPassword', async ({ email }, { rejectWithValue }) => {
  try {
    return await authService.forgotPassword(email);
  } catch (err) {
    return rejectWithValue(err);
  }
});

// POST /api/v1/auth/reset-password → cambia la contraseña con el código
export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, nuevaPassword }, { rejectWithValue }) => {
  try {
    return await authService.resetPassword(token, nuevaPassword);
  } catch (err) {
    return rejectWithValue(err);
  }
});
