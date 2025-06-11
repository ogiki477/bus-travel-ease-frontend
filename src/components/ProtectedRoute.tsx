// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "admin" | "customer";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    // Not logged in → redirect to login, saving where they were going
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.is_role !== role) {
    // Logged in but wrong role → could redirect elsewhere or show 403
    return <Navigate to="/" replace />;
  }

  // Authorized → render children
  return <>{children}</>;
};

export default ProtectedRoute;
