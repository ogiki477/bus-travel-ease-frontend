import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Bus {
  id: string;
  routeName: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  busNumber: string;
  companyName: string;
  highway: string;
  stops?: string[];
}

interface Seat {
  id: string;
  number: string;
  isAvailable: boolean;
  isSelected: boolean;
}

interface Booking {
  busId: string;
  selectedSeats: string[];
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  totalAmount: number;
  bookingDate: string;
  travelDate: string;
  bookingId?: string;
}

interface SearchParams {
  origin: string;
  destination: string;
  date: string;
}

interface BookingState {
  searchParams: SearchParams;
  foundBuses: Bus[];
  selectedBus: Bus | null;
  seats: Seat[];
  booking: Booking | null;
}

const initialState: BookingState = {
  searchParams: {
    origin: "",
    destination: "",
    date: "",
  },
  foundBuses: [],
  selectedBus: null,
  seats: [],
  booking: null,
};

// Eco Bus Company data - expanded routes along Kampala Juba Highway
const mockBuses: Bus[] = [
  // Direct Kampala to Juba routes
  {
    id: "eco-bus-1",
    routeName: "Kampala - Juba Express",
    origin: "Kampala",
    destination: "Juba",
    departureTime: "06:00 AM",
    arrivalTime: "08:00 PM",
    price: 180000,
    availableSeats: 32,
    busNumber: "ECO-KLA-JUB-001",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
    stops: ["Gulu", "Elegu"],
  },
  {
    id: "eco-bus-2",
    routeName: "Kampala - Juba Night Service",
    origin: "Kampala",
    destination: "Juba",
    departureTime: "10:00 PM",
    arrivalTime: "12:00 PM",
    price: 200000,
    availableSeats: 28,
    busNumber: "ECO-KLA-JUB-002",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
    stops: ["Gulu", "Elegu"],
  },
  {
    id: "eco-bus-3",
    routeName: "Kampala - Juba VIP",
    origin: "Kampala",
    destination: "Juba",
    departureTime: "08:00 AM",
    arrivalTime: "10:00 PM",
    price: 250000,
    availableSeats: 20,
    busNumber: "ECO-KLA-JUB-VIP-003",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
    stops: ["Gulu", "Elegu"],
  },
  
  // Kampala to Gulu routes
  {
    id: "eco-bus-7",
    routeName: "Kampala - Gulu Express",
    origin: "Kampala",
    destination: "Gulu",
    departureTime: "07:00 AM",
    arrivalTime: "01:00 PM",
    price: 45000,
    availableSeats: 35,
    busNumber: "ECO-KLA-GUL-007",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
  },
  {
    id: "eco-bus-8",
    routeName: "Kampala - Gulu Afternoon",
    origin: "Kampala",
    destination: "Gulu",
    departureTime: "02:00 PM",
    arrivalTime: "08:00 PM",
    price: 45000,
    availableSeats: 30,
    busNumber: "ECO-KLA-GUL-008",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
  },
  
  // Kampala to Elegu routes
  {
    id: "eco-bus-9",
    routeName: "Kampala - Elegu Express",
    origin: "Kampala",
    destination: "Elegu",
    departureTime: "06:30 AM",
    arrivalTime: "04:30 PM",
    price: 65000,
    availableSeats: 32,
    busNumber: "ECO-KLA-ELE-009",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
    stops: ["Gulu"],
  },
  {
    id: "eco-bus-10",
    routeName: "Kampala - Elegu Night",
    origin: "Kampala",
    destination: "Elegu",
    departureTime: "11:00 PM",
    arrivalTime: "09:00 AM",
    price: 70000,
    availableSeats: 28,
    busNumber: "ECO-KLA-ELE-010",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
    stops: ["Gulu"],
  },
  
  // Gulu to Juba routes
  {
    id: "eco-bus-11",
    routeName: "Gulu - Juba Express",
    origin: "Gulu",
    destination: "Juba",
    departureTime: "08:00 AM",
    arrivalTime: "04:00 PM",
    price: 120000,
    availableSeats: 30,
    busNumber: "ECO-GUL-JUB-011",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
    stops: ["Elegu"],
  },
  {
    id: "eco-bus-12",
    routeName: "Gulu - Juba Afternoon",
    origin: "Gulu",
    destination: "Juba",
    departureTime: "03:00 PM",
    arrivalTime: "11:00 PM",
    price: 120000,
    availableSeats: 25,
    busNumber: "ECO-GUL-JUB-012",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
    stops: ["Elegu"],
  },
  
  // Elegu to Juba routes
  {
    id: "eco-bus-13",
    routeName: "Elegu - Juba Express",
    origin: "Elegu",
    destination: "Juba",
    departureTime: "09:00 AM",
    arrivalTime: "02:00 PM",
    price: 80000,
    availableSeats: 35,
    busNumber: "ECO-ELE-JUB-013",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
  },
  {
    id: "eco-bus-14",
    routeName: "Elegu - Juba Evening",
    origin: "Elegu",
    destination: "Juba",
    departureTime: "05:00 PM",
    arrivalTime: "10:00 PM",
    price: 80000,
    availableSeats: 30,
    busNumber: "ECO-ELE-JUB-014",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
  },
  
  // Return routes - Juba to Kampala
  {
    id: "eco-bus-4",
    routeName: "Juba - Kampala Express",
    origin: "Juba",
    destination: "Kampala",
    departureTime: "06:00 AM",
    arrivalTime: "08:00 PM",
    price: 180000,
    availableSeats: 30,
    busNumber: "ECO-JUB-KLA-004",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
    stops: ["Elegu", "Gulu"],
  },
  {
    id: "eco-bus-5",
    routeName: "Juba - Kampala Night Service",
    origin: "Juba",
    destination: "Kampala",
    departureTime: "09:00 PM",
    arrivalTime: "11:00 AM",
    price: 200000,
    availableSeats: 25,
    busNumber: "ECO-JUB-KLA-005",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
    stops: ["Elegu", "Gulu"],
  },
  {
    id: "eco-bus-6",
    routeName: "Juba - Kampala VIP",
    origin: "Juba",
    destination: "Kampala",
    departureTime: "07:00 AM",
    arrivalTime: "09:00 PM",
    price: 250000,
    availableSeats: 18,
    busNumber: "ECO-JUB-KLA-VIP-006",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
    stops: ["Elegu", "Gulu"],
  },
  
  // Return routes - Juba to Gulu
  {
    id: "eco-bus-15",
    routeName: "Juba - Gulu Express",
    origin: "Juba",
    destination: "Gulu",
    departureTime: "07:30 AM",
    arrivalTime: "03:30 PM",
    price: 120000,
    availableSeats: 32,
    busNumber: "ECO-JUB-GUL-015",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
    stops: ["Elegu"],
  },
  
  // Return routes - Juba to Elegu
  {
    id: "eco-bus-16",
    routeName: "Juba - Elegu Express",
    origin: "Juba",
    destination: "Elegu",
    departureTime: "08:30 AM",
    arrivalTime: "01:30 PM",
    price: 80000,
    availableSeats: 28,
    busNumber: "ECO-JUB-ELE-016",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
  },
  
  // Return routes - Gulu to Kampala
  {
    id: "eco-bus-17",
    routeName: "Gulu - Kampala Morning",
    origin: "Gulu",
    destination: "Kampala",
    departureTime: "06:00 AM",
    arrivalTime: "12:00 PM",
    price: 45000,
    availableSeats: 35,
    busNumber: "ECO-GUL-KLA-017",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
  },
  {
    id: "eco-bus-18",
    routeName: "Gulu - Kampala Evening",
    origin: "Gulu",
    destination: "Kampala",
    departureTime: "04:00 PM",
    arrivalTime: "10:00 PM",
    price: 45000,
    availableSeats: 30,
    busNumber: "ECO-GUL-KLA-018",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
  },
  
  // Return routes - Elegu to Kampala
  {
    id: "eco-bus-19",
    routeName: "Elegu - Kampala Express",
    origin: "Elegu",
    destination: "Kampala",
    departureTime: "07:00 AM",
    arrivalTime: "05:00 PM",
    price: 65000,
    availableSeats: 32,
    busNumber: "ECO-ELE-KLA-019",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
    stops: ["Gulu"],
  },
  
  // Return routes - Elegu to Gulu
  {
    id: "eco-bus-20",
    routeName: "Elegu - Gulu Express",
    origin: "Elegu",
    destination: "Gulu",
    departureTime: "08:00 AM",
    arrivalTime: "12:00 PM",
    price: 25000,
    availableSeats: 40,
    busNumber: "ECO-ELE-GUL-020",
    companyName: "Eco Bus Company",
    highway: "Kampala Juba Highway",
  },
];

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<SearchParams>) => {
      state.searchParams = action.payload;
    },
    searchBuses: (state) => {
      const { origin, destination } = state.searchParams;
      const filteredBuses = mockBuses.filter(
        (bus) => 
          (!origin || bus.origin.toLowerCase() === origin.toLowerCase()) && 
          (!destination || bus.destination.toLowerCase() === destination.toLowerCase())
      );
      state.foundBuses = filteredBuses;
    },
    selectBus: (state, action: PayloadAction<Bus>) => {
      state.selectedBus = action.payload;
    },
    setSeats: (state, action: PayloadAction<Seat[]>) => {
      state.seats = action.payload;
    },
    toggleSeatSelection: (state, action: PayloadAction<string>) => {
      const seatId = action.payload;
      state.seats = state.seats.map((seat) => {
        if (seat.id === seatId && seat.isAvailable) {
          return { ...seat, isSelected: !seat.isSelected };
        }
        return seat;
      });
    },
    createBooking: (state, action: PayloadAction<{ name: string; email: string; phone: string }>) => {
      if (!state.selectedBus) return;

      const selectedSeats = state.seats.filter((seat) => seat.isSelected).map((seat) => seat.number);
      const totalAmount = state.selectedBus.price * selectedSeats.length;

      const newBooking: Booking = {
        busId: state.selectedBus.id,
        selectedSeats,
        passengerName: action.payload.name,
        passengerEmail: action.payload.email,
        passengerPhone: action.payload.phone,
        totalAmount,
        bookingDate: new Date().toISOString(),
        travelDate: state.searchParams.date || new Date().toISOString().split('T')[0],
        bookingId: `ECO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      };

      state.booking = newBooking;
    },
    resetBooking: (state) => {
      state.selectedBus = null;
      state.seats = [];
      state.booking = null;
    },
  },
});

export const {
  setSearchParams,
  searchBuses,
  selectBus,
  setSeats,
  toggleSeatSelection,
  createBooking,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
