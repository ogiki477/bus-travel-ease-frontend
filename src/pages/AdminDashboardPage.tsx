
import React, { useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector, useAppDispatch } from "@/store/hooks";

import { ArrowRightFromLine } from "lucide-react";

// Admin sub-pages
import AdminOverview from "@/components/admin/AdminOverview";
import AdminBookings from "@/components/admin/AdminBookings";
import AdminBuses from "@/components/admin/AdminBuses";
import AdminRoutes from "@/components/admin/AdminRoutes";
import { logoutUser } from "@/store/slices/authSlice";

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const getCurrentPath = () => {
    const path = location.pathname.split("/admin/")[1] || "";
    return path || "overview";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Admin Header */}
      <header className="bg-bus-dark text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold flex items-center">
              <span className="mr-2">🚌</span>
              UgandaBus
            </Link>
            <span className="bg-bus-secondary px-3 py-1 rounded text-sm font-medium">Admin</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              Logged in as <span className="font-medium">{user?.name}</span>
            </div>
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-bus-dark"
              onClick={handleLogout}
            >
              <ArrowRightFromLine className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Dashboard</h2>
            
            <nav className="space-y-1">
              <Link 
                to="/admin" 
                className={`block px-4 py-2 rounded-md ${
                  getCurrentPath() === "overview" 
                    ? "bg-bus-primary text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Overview
              </Link>
              <Link 
                to="/admin/bookings" 
                className={`block px-4 py-2 rounded-md ${
                  getCurrentPath() === "bookings" 
                    ? "bg-bus-primary text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Bookings
              </Link>
              <Link 
                to="/admin/buses" 
                className={`block px-4 py-2 rounded-md ${
                  getCurrentPath() === "buses" 
                    ? "bg-bus-primary text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Buses
              </Link>
              <Link 
                to="/admin/routes" 
                className={`block px-4 py-2 rounded-md ${
                  getCurrentPath() === "routes" 
                    ? "bg-bus-primary text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Routes
              </Link>
            </nav>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/bookings" element={<AdminBookings />} />
            <Route path="/buses" element={<AdminBuses />} />
            <Route path="/routes" element={<AdminRoutes />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
