
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import bookReducer from './slices/bookSlice';
import busReducer from './slices/busSlice';
import routeReducer from "./slices/routeSlice";
import scheduleReducer from "./slices/scheduleSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    bus: busReducer,
    schedule: scheduleReducer,
    routes: routeReducer,
    book: bookReducer,
  
  },
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
