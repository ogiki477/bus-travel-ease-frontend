// src/hooks/useAuth.ts
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logout = () => {
    // 1) Clear Redux + server token
    dispatch(logoutUser());

    // 2) Clear any leftover localStorage (if you persisted user/token manually)
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 3) Redirect to login
    navigate("/login", { replace: true });
  };

  return { logout };
};

export default useAuth;
