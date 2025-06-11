
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setSeats } from '../slices/bookingSlice';

interface Seat {
  id: string;
  number: string;
  isAvailable: boolean;
  isSelected: boolean;
}

export const getSeats = createAsyncThunk(
  'booking/getSeats',
  async (busId: string, { dispatch }) => {
    // Generate mock seats data
    const mockSeats: Seat[] = Array.from({ length: 40 }, (_, i) => {
      const seatNumber = (i + 1).toString().padStart(2, '0');
      const isAvailable = Math.random() > 0.3;
      
      return {
        id: `seat-${busId}-${seatNumber}`,
        number: seatNumber,
        isAvailable,
        isSelected: false,
      };
    });
    
    dispatch(setSeats(mockSeats));
    return mockSeats;
  }
);
