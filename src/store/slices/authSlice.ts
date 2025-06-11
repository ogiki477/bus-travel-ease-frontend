// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

// ---------------------
// 1. Types / Interfaces
// ---------------------

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  is_role: 'admin' | 'customer' | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// --------------------------------------
// 2. Hydrate initial state from localStorage
// --------------------------------------

const savedToken = localStorage.getItem('token');
let savedUser: User | null = null;
if (savedToken) {
  try {
    const raw = localStorage.getItem('user');
    if (raw) savedUser = JSON.parse(raw);
    axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

const initialState: AuthState = {
  user: savedUser,
  token: savedToken,
  isLoading: false,
  error: null,
};

// ------------------------------------------------------
// 3. Async Thunks: registerUser, loginUser, logoutUser
// ------------------------------------------------------

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    { name, email, phone, password, confirmPassword }: { name: string; email: string; phone?: string; password: string; confirmPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/register`,
        { name, email, phone, password, password_confirmation: confirmPassword },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        credentials,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE_URL}/logout`);
    } catch {
      return rejectWithValue('Logout failed');
    }
  }
);

// ------------------------------------------------------
// 4. Slice: reducers + extraReducers
// ------------------------------------------------------

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.token = payload.token;
        localStorage.setItem('token', payload.token);
        localStorage.setItem('user', JSON.stringify(payload.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.token = payload.token;
        localStorage.setItem('token', payload.token);
        localStorage.setItem('user', JSON.stringify(payload.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
      });
  },
});

export default authSlice.reducer;
