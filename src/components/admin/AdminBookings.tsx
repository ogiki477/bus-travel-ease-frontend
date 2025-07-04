
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminBookings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Mock bookings data
  const mockBookings = [
    { 
      id: "BK-123456", 
      passenger: "John Doe", 
      email: "john@example.com",
      phone: "+256 700 123 456",
      route: "Kampala - Arua", 
      date: "2025-05-16", 
      departureTime: "08:00 AM",
      seats: "02, 03", 
      amount: "UGX 100,000",
      status: "confirmed",
      createdAt: "2025-05-10",
    },
    { 
      id: "BK-123457", 
      passenger: "Jane Smith", 
      email: "jane@example.com",
      phone: "+256 701 234 567",
      route: "Kampala - Gulu", 
      date: "2025-05-16", 
      departureTime: "09:30 AM",
      seats: "15", 
      amount: "UGX 45,000",
      status: "confirmed",
      createdAt: "2025-05-11",
    },
    { 
      id: "BK-123458", 
      passenger: "", 
      email: "robert@example.com",
      phone: "+256 702 345 678",
      route: "Mbarara - Kampala", 
      date: "2025-05-17", 
      departureTime: "09:00 AM",
      seats: "10, 11, 12", 
      amount: "UGX 105,000",
      status: "pending",
      createdAt: "2025-05-13",
    },
    { 
      id: "BK-123459", 
      passenger: "Alice Nakato", 
      email: "alice@example.com",
      phone: "+256 703 456 789",
      route: "Arua - Kampala", 
      date: "2025-05-17", 
      departureTime: "08:00 PM",
      seats: "22", 
      amount: "UGX 50,000",
      status: "confirmed",
      createdAt: "2025-05-14",
    },
    { 
      id: "BK-123460", 
      passenger: "Brian Mugisha", 
      email: "brian@example.com",
      phone: "+256 704 567 890",
      route: "Kampala - Mbarara", 
      date: "2025-05-18", 
      departureTime: "10:00 AM",
      seats: "08, 09", 
      amount: "UGX 70,000",
      status: "cancelled",
      createdAt: "2025-05-14",
    },
    { 
      id: "BK-123461", 
      passenger: "Sarah Namuli", 
      email: "sarah@example.com",
      phone: "+256 705 678 901",
      route: "Gulu - Kampala", 
      date: "2025-05-18", 
      departureTime: "07:00 AM",
      seats: "05", 
      amount: "UGX 45,000",
      status: "confirmed",
      createdAt: "2025-05-15",
    },
    { 
      id: "BK-123462", 
      passenger: "David Ochen", 
      email: "david@example.com",
      phone: "+256 706 789 012",
      route: "Kampala - Mbarara", 
      date: "2025-05-19", 
      departureTime: "10:00 AM",
      seats: "25, 26", 
      amount: "UGX 70,000",
      status: "confirmed",
      createdAt: "2025-05-15",
    },
    { 
      id: "BK-123463", 
      passenger: "Patricia Auma", 
      email: "patricia@example.com",
      phone: "+256 707 890 123",
      route: "Kampala - Arua", 
      date: "2025-05-20", 
      departureTime: "08:00 AM",
      seats: "16", 
      amount: "UGX 50,000",
      status: "pending",
      createdAt: "2025-05-15",
    },
  ];

  // Filter bookings based on search term and status filter
  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.passenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.route.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bookings Management</h1>
        <p className="text-gray-500">View and manage all bus bookings</p>
      </div>
      
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <Input
            placeholder="Search by ID, passenger, or route"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full sm:w-1/4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-grow flex justify-end">
          <Button className="bg-bus-primary hover:bg-blue-700">Export Data</Button>
        </div>
      </div>
      
      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Booking ID</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Passenger</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Route</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Travel Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Seats</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{booking.id}</td>
                      <td className="px-4 py-3">{booking.passenger}</td>
                      <td className="px-4 py-3">{booking.route}</td>
                      <td className="px-4 py-3">{booking.date}<br/><span className="text-xs text-gray-500">{booking.departureTime}</span></td>
                      <td className="px-4 py-3">{booking.seats}</td>
                      <td className="px-4 py-3">{booking.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 ${getStatusBadge(booking.status)} rounded-full text-xs`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          {booking.status !== "cancelled" && (
                            <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                      No bookings found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;
