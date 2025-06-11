// src/components/AuthInitializer.tsx
import React, { useEffect, PropsWithChildren } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initializeAuth, clearAuthError } from "@/store/slices/authSlice";
import axios from "axios";

const AuthInitializer: React.FC<PropsWithChildren<object>> = ({ children }) => {
  const dispatch = useAppDispatch();
  const didInit = useAppSelector((state) => state.auth.didInitialize);

  useEffect(() => {
    // If we've already initialized once, skip
    if (didInit) return;

    // Check localStorage
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
        dispatch(initializeAuth({ user: userObj, token: savedToken }));
      } catch {
        // Bad JSON or something—just clear out and mark initialized
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(clearAuthError()); 
        // Optionally dispatch a separate `initializedWithoutUser()` action if you want
      }
    } else {
      // No token → still mark as “initialized” so pages know they can check authentication safely
      dispatch(clearAuthError());
    }
  }, [dispatch, didInit]);

  // While we're still hydrating, we might render nothing or a spinner.
  // Only render children once didInit===true.
  if (!didInit) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
};

export default AuthInitializer;
