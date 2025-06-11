// src/components/Navbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";  // ← import the correct thunk

const Navbar: React.FC = () => {
  // Grab `user` from the auth slice; derive isAuthenticated as !!user
  const { user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!user;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const isAdmin = () => {
    return user?.is_role === "admin";  // ← use `is_role` instead of `role`
  };

  return (
    <nav className="bg-green-600 text-black py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center text-black">
          <span className="mr-2">🚌</span>
          EcoBus
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-green-200 transition-colors text-black font-bold">
            Home
          </Link>
          <Link to="/search" className="hover:text-green-200 transition-colors text-black font-bold">
            Book Tickets
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {isAdmin() && (
                <Link 
                  to="/admin" 
                  className="text-green-200 hover:text-black transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}
              <span className="text-black">Hello, {user?.name}</span>
              <Button 
                variant="outline" 
                className="bg-transparent text-black border-black hover:bg-black hover:text-green-600"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="link" className="text-black hover:text-green-200 font-bold">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-green-800 hover:bg-green-900 text-white font-bold">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
