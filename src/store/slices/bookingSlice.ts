// src/store/slices/bookingSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { searchBuses as fetchBusesThunk } from "../thunks/bookingThunks";
import { getSeats as fetchSeatsThunk } from "../thunks/bookingThunks";
import { fetchAllBuses, searchBuses } from "@/store/thunks/bookingThunks";

export interface Bus {
  id: string;
  routeName: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  departureFull?: string;  // ISO datetime 
  arrivalFull?: string;    // ISO datetime
  price: number;
  availableSeats: number;
  busNumber: string;
  companyName: string;
  busPic?: string;            // <-- new
}

export interface Seat {
  id: string;
  number: string;
  isAvailable: boolean;
  isSelected: boolean;
}

export interface BookingInfo {
  busId: string;
  selectedSeats: string[];
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  totalAmount: number;
  bookingDate: string;
  travelDate: string;
  bookingId: string;
}

export interface SearchParams {
  origin: string;
  destination: string;
  date: string;
}

interface BookingState {
  searchParams: SearchParams;
  foundBuses: Bus[];
  selectedBus: Bus | null;
  seats: Seat[];
  booking: BookingInfo | null;
}

const initialState: BookingState = {
  searchParams: { origin: "", destination: "", date: "" },
  foundBuses: [],
  selectedBus: null,
  seats: [],
  booking: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setSearchParams(state, action: PayloadAction<SearchParams>) {
      state.searchParams = action.payload;
    },
    selectBus(state, action: PayloadAction<Bus>) {
      state.selectedBus = action.payload;
    },
    setSeats(state, action: PayloadAction<Seat[]>) {
      state.seats = action.payload;
    },
    toggleSeatSelection(state, action: PayloadAction<string>) {
      const seatId = action.payload;
      state.seats = state.seats.map((seat) =>
        seat.id === seatId && seat.isAvailable
          ? { ...seat, isSelected: !seat.isSelected }
          : seat
      );
    },
    createBooking(
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        phone: string;
      }>
    ) {
      if (!state.selectedBus) return;
      const selectedSeatNumbers = state.seats
        .filter((s) => s.isSelected)
        .map((s) => s.number);
      const totalAmount = state.selectedBus.price * selectedSeatNumbers.length;
      state.booking = {
        busId: state.selectedBus.id,
        selectedSeats: selectedSeatNumbers,
        passengerName: action.payload.name,
        passengerEmail: action.payload.email,
        passengerPhone: action.payload.phone,
        totalAmount,
        bookingDate: new Date().toISOString(),
        travelDate: state.searchParams.date || new Date().toISOString().split("T")[0],
        bookingId: `ECO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      };
    },
    resetBooking(state) {
      state.selectedBus = null;
      state.seats = [];
      state.booking = null;
    },
  },
  extraReducers: (builder) => {
    // load buses
   builder
      .addCase(fetchAllBuses.pending, (state) => {
        // you could set a loading flag, or clear out
        state.foundBuses = [];
      })
      .addCase(fetchAllBuses.fulfilled, (state, action) => {
        // on initial load show **all** buses
        state.foundBuses = action.payload;
      })
      .addCase(searchBuses.fulfilled, (state, action) => {
        // overwrite with schedule-based search
        state.foundBuses = action.payload;
      })

    // load seats
    builder
      .addCase(fetchSeatsThunk.fulfilled, (state, action) => {
        state.seats = action.payload;
      });
      
  },
});

export const {
  setSearchParams,
  selectBus,
  setSeats,
  toggleSeatSelection,
  createBooking,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
