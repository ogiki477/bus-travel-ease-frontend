// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "@/components/ProtectedRoute";

const App: React.FC = () => (
  <>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />

        {/* Only logged-in users can select seats or confirm booking */}
        <Route
          path="/seat-selection/:busId"
          element={
            <ProtectedRoute>
              <SeatSelectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-confirmation"
          element={
            <ProtectedRoute>
              <BookingConfirmationPage />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin only */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </>
);

export default App;
