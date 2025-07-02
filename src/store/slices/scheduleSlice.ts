import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

export interface Schedule {
  id: number;
  departure_time: string;
  arrival_time: string;
  bus: {
    id: number;
    name: string;
    number_plate: string;
    total_seats: number;
    bus_pic: string;
  };
  route: {
    origin: string;
    destination: string;
    base_price: string;
  };
}

interface ScheduleState {
  schedules: Schedule[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ScheduleState = {
  schedules: [],
  isLoading: false,
  error: null,
};

export const fetchSchedules = createAsyncThunk<
  Schedule[],
  { origin: string; destination: string; date?: string }
>(
  "schedules/fetchByRoute",
  async (params, { rejectWithValue }) => {
    try {
      const resp = await axios.get<Schedule[]>(`${API_BASE_URL}/schedules`, {
        params,
      });
      return resp.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load schedules");
    }
  }
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    clearSchedules(state) {
      state.schedules = [];
    },
  },
  extraReducers: (b) =>
    b
      .addCase(fetchSchedules.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (s, a: PayloadAction<Schedule[]>) => {
        s.isLoading = false;
        s.schedules = a.payload;
      })
      .addCase(fetchSchedules.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload as string;
      }),
});

export const { clearSchedules } = scheduleSlice.actions;
export default scheduleSlice.reducer;
