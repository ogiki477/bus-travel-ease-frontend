// src/store/thunks/bookingThunks.ts
import type { Bus } from "../slices/bookingSlice";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { type SearchParams,setSeats } from "../slices/bookingSlice";

interface BusAPI {
  id: number;
  name: string;
  number_plate: string;
  total_seats: number;
  amenities: string;
  bus_pic: string;
}

interface ScheduleAPI {
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

interface Seat {
  id: string;
  number: string;
  isAvailable: boolean;
  isSelected: boolean;
}

export const searchBuses = createAsyncThunk<
  Bus[],             // what we'll return
  void,              // no args
  { state: { booking: { searchParams: SearchParams } } }
>(
  "booking/searchBuses",
  async (_, { getState, rejectWithValue }) => {
    const { origin, destination, date } = getState().booking.searchParams;
    if (!origin || !destination) {
      return rejectWithValue("Must provide origin & destination");
    }

    const resp = await axios.get<ScheduleAPI[]>("/api/schedules", {
      params: { origin, destination, date },
    });

    return resp.data
      // optionally filter if your backend doesn't already
      .filter((s) =>
        s.route.origin.toLowerCase() === origin.toLowerCase() &&
        s.route.destination.toLowerCase() === destination.toLowerCase()
      )
      .map<Bus>((s) => ({
        id: String(s.id),
        routeName: `${s.route.origin} - ${s.route.destination}`,
        origin: s.route.origin,
        destination: s.route.destination,
        departureTime: new Date(s.departure_time)
          .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        arrivalTime: new Date(s.arrival_time)
          .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        price: parseFloat(s.route.base_price),
        availableSeats: s.bus.total_seats,          // or subtract booked seats
        busNumber: s.bus.number_plate,
        companyName: s.bus.name,
        highway: "",                                // fill if you have it
        stops: [],                                  // fill if you have it
      }));
  }
);


export const getSeats = createAsyncThunk<Seat[], string>(
  "booking/getSeats",
  async (busId, { dispatch }) => {
    // For now we generate mock seats client-side
    const mockSeats: Seat[] = Array.from({ length: 40 }, (_, i) => {
      const number = (i + 1).toString().padStart(2, "0");
      return {
        id: `seat-${busId}-${number}`,
        number,
        isAvailable: Math.random() > 0.3,
        isSelected: false,
      };
    });
    dispatch(setSeats(mockSeats));
    return mockSeats;
  }
);


export const fetchAllBuses = createAsyncThunk<Bus[]>(
  "booking/fetchAllBuses",
  async () => {
    const resp = await axios.get<BusAPI[]>("/api/buses");
    return resp.data.map<Bus>((b) => ({
      id: String(b.id),
      routeName: b.name,          // temporarily show the bus name
      origin: "",                 // no origin yet
      destination: "",
      departureTime: "",
      arrivalTime: "",
      price: 0,
      availableSeats: b.total_seats,
      busNumber: b.number_plate,
      companyName: b.name,
      highway: "",
      stops: [],
    }));
  }
);