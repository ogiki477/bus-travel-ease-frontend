
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminRoutes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddRouteOpen, setIsAddRouteOpen] = useState(false);
  const [newRoute, setNewRoute] = useState({
    origin: "",
    destination: "",
    distance: "",
    duration: "",
    standardPrice: "",
  });
  
  // Mock routes data
  const mockRoutes = [
    { 
      id: "ROUTE-001", 
      name: "Kampala - Arua", 
      origin: "Kampala", 
      destination: "Arua",
      distance: "520 km",
      duration: "8 hours",
      standardPrice: 50000,
      activeSchedules: 4,
      status: "active",
    },
    { 
      id: "ROUTE-002", 
      name: "Kampala - Gulu", 
      origin: "Kampala", 
      destination: "Gulu",
      distance: "330 km",
      duration: "6 hours",
      standardPrice: 45000,
      activeSchedules: 3,
      status: "active",
    },
    { 
      id: "ROUTE-003", 
      name: "Kampala - Mbarara", 
      origin: "Kampala", 
      destination: "Mbarara",
      distance: "260 km",
      duration: "3 hours",
      standardPrice: 35000,
      activeSchedules: 5,
      status: "active",
    },
    { 
      id: "ROUTE-004", 
      name: "Arua - Kampala", 
      origin: "Arua", 
      destination: "Kampala",
      distance: "520 km",
      duration: "8 hours",
      standardPrice: 50000,
      activeSchedules: 2,
      status: "active",
    },
    { 
      id: "ROUTE-005", 
      name: "Gulu - Kampala", 
      origin: "Gulu", 
      destination: "Kampala",
      distance: "330 km",
      duration: "6 hours",
      standardPrice: 45000,
      activeSchedules: 3,
      status: "active",
    },
    { 
      id: "ROUTE-006", 
      name: "Mbarara - Kampala", 
      origin: "Mbarara", 
      destination: "Kampala",
      distance: "260 km",
      duration: "3 hours",
      standardPrice: 35000,
      activeSchedules: 4,
      status: "active",
    },
    { 
      id: "ROUTE-007", 
      name: "Kampala - Jinja", 
      origin: "Kampala", 
      destination: "Jinja",
      distance: "80 km",
      duration: "1.5 hours",
      standardPrice: 15000,
      activeSchedules: 8,
      status: "active",
    },
    { 
      id: "ROUTE-008", 
      name: "Kampala - Mbale", 
      origin: "Kampala", 
      destination: "Mbale",
      distance: "220 km",
      duration: "4 hours",
      standardPrice: 30000,
      activeSchedules: 3,
      status: "active",
    },
    { 
      id: "ROUTE-009", 
      name: "Kampala - Soroti", 
      origin: "Kampala", 
      destination: "Soroti",
      distance: "340 km",
      duration: "5 hours",
      standardPrice: 40000,
      activeSchedules: 2,
      status: "inactive",
    },
  ];

  // Filter routes based on search term
  const filteredRoutes = mockRoutes.filter(route => 
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRoute = () => {
    // In a real app, this would connect to an API to add the route
    setIsAddRouteOpen(false);
    setNewRoute({
      origin: "",
      destination: "",
      distance: "",
      duration: "",
      standardPrice: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRoute(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format price to UGX
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Routes Management</h1>
        <p className="text-gray-500">View and manage all bus routes</p>
      </div>
      
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <Input
            placeholder="Search by route name, origin, or destination"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-grow flex justify-end">
          <Dialog open={isAddRouteOpen} onOpenChange={setIsAddRouteOpen}>
            <DialogTrigger asChild>
              <Button className="bg-bus-primary hover:bg-blue-700">Add New Route</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Route</DialogTitle>
                <DialogDescription>
                  Enter the details of the new route to add it to the system.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="origin" className="text-right">
                    Origin
                  </Label>
                  <Input
                    id="origin"
                    name="origin"
                    placeholder="Starting point"
                    className="col-span-3"
                    value={newRoute.origin}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="destination" className="text-right">
                    Destination
                  </Label>
                  <Input
                    id="destination"
                    name="destination"
                    placeholder="End point"
                    className="col-span-3"
                    value={newRoute.destination}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="distance" className="text-right">
                    Distance (km)
                  </Label>
                  <Input
                    id="distance"
                    name="distance"
                    placeholder="e.g. 250"
                    className="col-span-3"
                    value={newRoute.distance}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">
                    Duration
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    placeholder="e.g. 4 hours"
                    className="col-span-3"
                    value={newRoute.duration}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="standardPrice" className="text-right">
                    Standard Price
                  </Label>
                  <Input
                    id="standardPrice"
                    name="standardPrice"
                    type="number"
                    placeholder="e.g. 35000"
                    className="col-span-3"
                    value={newRoute.standardPrice}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddRouteOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddRoute}>
                  Add Route
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Route ID</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Route Name</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Origin</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Destination</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Distance</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Duration</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Standard Price</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.length > 0 ? (
                  filteredRoutes.map((route) => (
                    <tr key={route.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{route.id}</td>
                      <td className="px-4 py-3">{route.name}</td>
                      <td className="px-4 py-3">{route.origin}</td>
                      <td className="px-4 py-3">{route.destination}</td>
                      <td className="px-4 py-3">{route.distance}</td>
                      <td className="px-4 py-3">{route.duration}</td>
                      <td className="px-4 py-3">{formatPrice(route.standardPrice)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 ${getStatusBadge(route.status)} rounded-full text-xs`}>
                          {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          {route.status === "active" ? (
                            <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                              Disable
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="text-green-500 border-green-200 hover:bg-green-50">
                              Enable
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                      No routes found matching your search.
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

export default AdminRoutes;
