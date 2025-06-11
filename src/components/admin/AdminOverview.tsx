
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminOverview: React.FC = () => {
  // Mock data for the dashboard
  const stats = [
    { title: "Total Bookings", value: "1,248", change: "+12% from last month" },
    { title: "Active Buses", value: "42", change: "2 buses added this month" },
    { title: "Total Routes", value: "18", change: "Across 8 districts" },
    { title: "Revenue (Monthly)", value: "UGX 24.5M", change: "+8% from last month" },
  ];

  const recentBookings = [
    { id: "BK-123456", passenger: "John Doe", route: "Kampala - Arua", date: "2025-05-16", seats: "2", amount: "UGX 100,000" },
    { id: "BK-123457", passenger: "Jane Smith", route: "Kampala - Gulu", date: "2025-05-16", seats: "1", amount: "UGX 45,000" },
    { id: "BK-123458", passenger: "Robert Johnson", route: "Mbarara - Kampala", date: "2025-05-17", seats: "3", amount: "UGX 105,000" },
    { id: "BK-123459", passenger: "Alice Nakato", route: "Arua - Kampala", date: "2025-05-17", seats: "1", amount: "UGX 50,000" },
    { id: "BK-123460", passenger: "Brian Mugisha", route: "Kampala - Mbarara", date: "2025-05-18", seats: "2", amount: "UGX 70,000" },
  ];

  const upcomingDepartures = [
    { id: "BUS-001", route: "Kampala - Arua", time: "08:00 AM", date: "2025-05-16", bookings: "34/40" },
    { id: "BUS-002", route: "Kampala - Gulu", time: "09:30 AM", date: "2025-05-16", bookings: "28/40" },
    { id: "BUS-003", route: "Kampala - Mbarara", time: "10:00 AM", date: "2025-05-16", bookings: "22/40" },
    { id: "BUS-004", route: "Arua - Kampala", time: "08:00 PM", date: "2025-05-16", bookings: "30/40" },
    { id: "BUS-005", route: "Gulu - Kampala", time: "07:00 AM", date: "2025-05-17", bookings: "18/40" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome to the admin dashboard</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Tabs for different views */}
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
          <TabsTrigger value="departures">Upcoming Departures</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Booking ID</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Passenger</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Route</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Date</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Seats</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{booking.id}</td>
                        <td className="px-4 py-3">{booking.passenger}</td>
                        <td className="px-4 py-3">{booking.route}</td>
                        <td className="px-4 py-3">{booking.date}</td>
                        <td className="px-4 py-3">{booking.seats}</td>
                        <td className="px-4 py-3">{booking.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departures">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Departures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Bus ID</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Route</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Time</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Date</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Bookings</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingDepartures.map((departure) => (
                      <tr key={departure.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{departure.id}</td>
                        <td className="px-4 py-3">{departure.route}</td>
                        <td className="px-4 py-3">{departure.time}</td>
                        <td className="px-4 py-3">{departure.date}</td>
                        <td className="px-4 py-3">{departure.bookings}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Scheduled
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminOverview;
