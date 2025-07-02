import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

export interface Route {
  id: number;
  origin: string;
  destination: string;
  distance: string;
  base_price: string;
}

interface RouteState {
  routes: Route[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RouteState = {
  routes: [],
  isLoading: false,
  error: null,
};

export const fetchRoutes = createAsyncThunk<Route[]>(
  "routes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axios.get<Route[]>(`${API_BASE_URL}/routes`);
      return resp.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load routes");
    }
  }
);

const routeSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {},
  extraReducers: (b) =>
    b
      .addCase(fetchRoutes.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(fetchRoutes.fulfilled, (s, a) => {
        s.isLoading = false;
        s.routes = a.payload;
      })
      .addCase(fetchRoutes.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload as string;
      }),
});

export default routeSlice.reducer;
