// src/store/slices/busSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_BASE_URL } from '../apiConfig'

// 1) Define the raw API shape
export interface Bus {
  id: number
  name: string
  number_plate: string
  total_seats: number
  amenities: string
  bus_pic: string
  created_at: string
  updated_at: string
}

// 2) Create an async thunk to fetch all buses
export const fetchAllBuses = createAsyncThunk<Bus[], void, { rejectValue: string }>(
  'bus/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axios.get<Bus[]>(`${API_BASE_URL}/buses`)
      return resp.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Could not load buses')
    }
  }
)

// 3) Slice state shape
interface BusState {
  buses: Bus[]
  isLoading: boolean
  error: string | null
}

const initialState: BusState = {
  buses: [],
  isLoading: false,
  error: null,
}

// 4) Create slice in one place
const busSlice = createSlice({
  name: 'bus',
  initialState,
  reducers: {
    // (optionally) you could add sync reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBuses.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllBuses.fulfilled, (state, action: PayloadAction<Bus[]>) => {
        state.isLoading = false
        state.buses = action.payload
      })
      .addCase(fetchAllBuses.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload ?? 'Unknown error'
      })
  },
})

export default busSlice.reducer
