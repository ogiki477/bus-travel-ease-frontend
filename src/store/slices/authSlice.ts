// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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
  didInitialize: boolean;   // new flag
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  didInitialize: false,
};

// ------------------------------------------------------
// 2. Async Thunks: registerUser, loginUser, logoutUser
// ------------------------------------------------------

// registerUser: expects { name, email, phone?, password, confirmPassword }
export const registerUser = createAsyncThunk<
  { user: User; token: string },
  { name: string; email: string; phone?: string; password: string; confirmPassword: string },
  { rejectValue: string }
>(
  'auth/registerUser',
  async (formData, thunkAPI) => {
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      };

      const response = await axios.post<{ message: string; user: User; token: string }>(
        `${API_BASE_URL}/register`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      return {
        user: response.data.user,
        token: response.data.token,
      };
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        // validation errors (422) come back as an object of arrays
        if (err.response.status === 422 && typeof err.response.data === 'object') {
          const validationErrors = err.response.data as Record<string, unknown>;
          const firstKey = Object.keys(validationErrors)[0];
          const firstMsg = Array.isArray(validationErrors[firstKey])
            ? (validationErrors[firstKey] as string[])[0]
            : 'Validation error';
          return thunkAPI.rejectWithValue(firstMsg);
        }
        // other errors with a "message" field
        if (
          err.response.data &&
          typeof err.response.data === 'object' &&
          'message' in err.response.data
        ) {
          return thunkAPI.rejectWithValue((err.response.data as { message: string }).message);
        }
      }
      return thunkAPI.rejectWithValue('Registration failed. Please try again.');
    }
  }
);

// loginUser: expects { email, password }
export const loginUser = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const payload = {
        email: credentials.email,
        password: credentials.password,
      };

      const response = await axios.post<{ message: string; user: User; token: string }>(
        `${API_BASE_URL}/login`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      return {
        user: response.data.user,
        token: response.data.token,
      };
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        if (
          err.response.data &&
          typeof err.response.data === 'object' &&
          'message' in err.response.data
        ) {
          return thunkAPI.rejectWithValue((err.response.data as { message: string }).message);
        }
      }
      return thunkAPI.rejectWithValue('Login failed. Please check your credentials.');
    }
  }
);

// logoutUser: no args, but we need access to state.auth.token
export const logoutUser = createAsyncThunk<void, void, { state: { auth: AuthState }; rejectValue: string }>(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue('No token found');
    }

    try {
      await axios.post(
        `${API_BASE_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return;
    } catch {
      return thunkAPI.rejectWithValue('Logout failed. Please try again.');
    }
  }
);

// ------------------------------------------------------
// 3. Slice: reducers + extraReducers
// ------------------------------------------------------

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 3.1 initializeAuth: load saved user & token (e.g. from localStorage)
    initializeAuth(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      state.error = null;
      state.didInitialize = true;    // mark that we’re done hydrating
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
    },

    // 3.2 clearAuthError: reset only the error field
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // registerUser
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      registerUser.fulfilled,
      (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
         state.didInitialize = true;    // also mark initialized on fresh register
        // persist to localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      }
    );
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? 'Registration failed';
    });

    // loginUser
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.didInitialize = true;    // mark init on login
        // persist to localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      }
    );
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? 'Login failed';
    });

    // logoutUser
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.didInitialize = true;    // still consider init done
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }); 
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? 'Logout failed';
    });
  },
});

// ------------------------------------------------------
// 4. Exports
// ------------------------------------------------------

export const { initializeAuth, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
