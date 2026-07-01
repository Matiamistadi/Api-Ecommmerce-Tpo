import { createAsyncThunk } from '@reduxjs/toolkit';
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
