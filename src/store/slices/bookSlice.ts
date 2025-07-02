/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/slices/bookSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

// ——— Types ———
export interface Bus {
  id: number;
  name: string;
  number_plate: string;
  total_seats: number;
  amenities: string;
  bus_pic: string;
  created_at: string;
  updated_at: string;
}

export interface Route {
  id: number;
  origin: string;
  destination: string;
  distance: string;
  base_price: string;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: number;
  bus_id: number;
  route_id: number;
  departure_time: string;
  arrival_time: string;
  status: string;
  created_at: string;
  updated_at: string;
  bus: Bus;
  route: Route;
}

export interface Booking {
  id: number;
  user_id: number;
  schedule_id: number;
  booking_reference: string;
  price: string;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  schedule: Schedule;
}

// ——— State ———
interface BookState {
  booking: Booking | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BookState = {
  booking: null,
  isLoading: false,
  error: null,
};

// ——— Async Thunk ———
export const createBooking = createAsyncThunk<
  Booking,
  { schedule_id: number; payment_method: string; price: number  },
  { rejectValue: string }
>(
  "book/createBooking",
  async (payload, { rejectWithValue }) => {
    try {
      const resp = await axios.post<{
        message: string;
        booking: Booking;
      }>(`${API_BASE_URL}/bookings`, payload);
      return resp.data.booking;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to create booking"
      );
    }
  }
);

// ——— Slice ———
const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    resetBooking(state) {
      state.booking = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createBooking.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.isLoading = false;
          state.booking = action.payload;
        }
      )
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { resetBooking } = bookSlice.actions;
export default bookSlice.reducer;
