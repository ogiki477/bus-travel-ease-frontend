
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminBuses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddBusOpen, setIsAddBusOpen] = useState(false);
  const [newBus, setNewBus] = useState({
    busNumber: "",
    capacity: "",
    companyName: "",
    busType: "standard",
  });
  
  // Mock buses data
  const mockBuses = [
    { 
      id: "BUS-001", 
      busNumber: "KLA-ARU-001", 
      companyName: "Gateway Bus Services", 
      capacity: 40,
      busType: "Executive",
      status: "active",
      lastMaintenance: "2025-04-20",
      totalTrips: 128,
    },
    { 
      id: "BUS-002", 
      busNumber: "KLA-GUL-002", 
      companyName: "Link Bus Services", 
      capacity: 40,
      busType: "Standard",
      status: "active",
      lastMaintenance: "2025-04-25",
      totalTrips: 112,
    },
    { 
      id: "BUS-003", 
      busNumber: "KLA-MBA-003", 
      companyName: "YY Coaches", 
      capacity: 45,
      busType: "VIP",
      status: "active",
      lastMaintenance: "2025-05-01",
      totalTrips: 98,
    },
    { 
      id: "BUS-004", 
      busNumber: "ARU-KLA-004", 
      companyName: "Gateway Bus Services", 
      capacity: 40,
      busType: "Executive",
      status: "maintenance",
      lastMaintenance: "2025-05-10",
      totalTrips: 86,
    },
    { 
      id: "BUS-005", 
      busNumber: "GUL-KLA-005", 
      companyName: "Link Bus Services", 
      capacity: 40,
      busType: "Standard",
      status: "active",
      lastMaintenance: "2025-04-18",
      totalTrips: 105,
    },
    { 
      id: "BUS-006", 
      busNumber: "MBA-KLA-006", 
      companyName: "YY Coaches", 
      capacity: 45,
      busType: "VIP",
      status: "active",
      lastMaintenance: "2025-04-30",
      totalTrips: 92,
    },
  ];

  // Filter buses based on search term
  const filteredBuses = mockBuses.filter(bus => 
    bus.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBus = () => {
    // In a real app, this would connect to an API to add the bus
    setIsAddBusOpen(false);
    setNewBus({
      busNumber: "",
      capacity: "",
      companyName: "",
      busType: "standard",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBus(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bus Management</h1>
        <p className="text-gray-500">View and manage all buses in the fleet</p>
      </div>
      
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <Input
            placeholder="Search by ID, bus number, or company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-grow flex justify-end">
          <Dialog open={isAddBusOpen} onOpenChange={setIsAddBusOpen}>
            <DialogTrigger asChild>
              <Button className="bg-bus-primary hover:bg-blue-700">Add New Bus</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Bus</DialogTitle>
                <DialogDescription>
                  Enter the details of the new bus to add it to the fleet.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="busNumber" className="text-right">
                    Bus Number
                  </Label>
                  <Input
                    id="busNumber"
                    name="busNumber"
                    placeholder="KLA-XXX-000"
                    className="col-span-3"
                    value={newBus.busNumber}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="companyName" className="text-right">
                    Company
                  </Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Bus Company Name"
                    className="col-span-3"
                    value={newBus.companyName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">
                    Capacity
                  </Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    placeholder="40"
                    className="col-span-3"
                    value={newBus.capacity}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="busType" className="text-right">
                    Bus Type
                  </Label>
                  <Select 
                    value={newBus.busType} 
                    onValueChange={(value) => setNewBus(prev => ({ ...prev, busType: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select bus type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddBusOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddBus}>
                  Add Bus
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Buses Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Buses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Bus ID</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Bus Number</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Company</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Capacity</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Type</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Maintenance</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuses.length > 0 ? (
                  filteredBuses.map((bus) => (
                    <tr key={bus.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{bus.id}</td>
                      <td className="px-4 py-3">{bus.busNumber}</td>
                      <td className="px-4 py-3">{bus.companyName}</td>
                      <td className="px-4 py-3">{bus.capacity} seats</td>
                      <td className="px-4 py-3">{bus.busType}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 ${getStatusBadge(bus.status)} rounded-full text-xs`}>
                          {bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{bus.lastMaintenance}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                            Deactivate
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                      No buses found matching your search.
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

export default AdminBuses;
