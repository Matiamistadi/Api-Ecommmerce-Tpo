import { createAsyncThunk } from '@reduxjs/toolkit';
import { getResumenAdmin } from '../../services/adminService';

// GET combinado (órdenes + usuarios en paralelo) que arma estadísticas para el panel admin
export const fetchResumenAdmin = createAsyncThunk('admin/fetchResumen', async (_, { rejectWithValue }) => {
  try {
    return await getResumenAdmin();
  } catch (err) {
    return rejectWithValue(err);
  }
});
