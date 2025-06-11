import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setSearchParams } from "@/store/slices/bookingSlice";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { searchParams } = useAppSelector((state) => state.booking);
  
  const locations = [
    "Kampala", "Gulu", "Elegu", "Juba"
  ];

  const handleSearchClick = () => {
    if (searchParams.origin && searchParams.destination) {
      navigate("/search");
    }
  };

  const updateSearchParams = (field: string, value: string) => {
    dispatch(setSearchParams({
      ...searchParams,
      [field]: value
    }));
  };

  const features = [
    {
      title: "Reliable Cross-Border Travel",
      description: "Safe and comfortable journey between Uganda and South Sudan via the Kampala Juba Highway.",
      icon: "🚌"
    },
    {
      title: "Multiple Stops Available",
      description: "Convenient stops at Gulu and Elegu along the Kampala Juba Highway for your travel needs.",
      icon: "🛣️"
    },
    {
      title: "Real-time Seat Selection",
      description: "Choose your preferred seat from an interactive seat map for your long journey.",
      icon: "💺"
    },
    {
      title: "Instant Confirmation",
      description: "Receive your e-ticket instantly after booking is confirmed.",
      icon: "✅"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-green-50">
      <Navbar />
      
      {/* Hero Section with Bus Background */}
      <div 
        className="relative py-20 px-6 md:px-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.1)), url('/lovable-uploads/e2395230-5fd7-438d-92d4-651ed01238f4.png')`
        }}
      >
        <div className="container mx-auto relative">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Travel Along the Kampala Juba Highway
            </h1>
            <p className="text-xl mb-8 text-white">
              Book your bus tickets with Eco Bus Company for safe and comfortable travel 
              between Kampala, Gulu, Elegu, and Juba via the Kampala Juba Highway.
            </p>
            
            {/* Quick search form */}
            <Card className="bg-white p-6 rounded-lg shadow-xl">
              <CardContent className="p-0">
                <div className="text-black text-lg font-medium mb-4">Find Your Bus</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">From</label>
                    <Select
                      value={searchParams.origin}
                      onValueChange={(value) => updateSearchParams('origin', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select origin" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">To</label>
                    <Select
                      value={searchParams.destination}
                      onValueChange={(value) => updateSearchParams('destination', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Date</label>
                    <input
                      type="date"
                      className="w-full h-10 px-3 rounded-md border border-gray-300"
                      value={searchParams.date}
                      onChange={(e) => updateSearchParams('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleSearchClick}
                >
                  Search Buses
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose Eco Bus Company?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-t-4 border-green-500 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-green-600">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Popular Routes Section */}
      <div className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Popular Routes on Kampala Juba Highway
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { from: "Kampala", to: "Juba", price: "UGX 180,000", time: "14 hours", service: "Express", stops: "via Gulu, Elegu" },
              { from: "Kampala", to: "Gulu", price: "UGX 45,000", time: "6 hours", service: "Express", stops: "Direct route" },
              { from: "Kampala", to: "Elegu", price: "UGX 65,000", time: "10 hours", service: "Express", stops: "via Gulu" },
              { from: "Gulu", to: "Juba", price: "UGX 120,000", time: "8 hours", service: "Express", stops: "via Elegu" },
              { from: "Elegu", to: "Juba", price: "UGX 80,000", time: "5 hours", service: "Express", stops: "Direct route" },
              { from: "Juba", to: "Kampala", price: "UGX 180,000", time: "14 hours", service: "Express", stops: "via Elegu, Gulu" },
            ].map((route, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-semibold">{route.from}</div>
                    <div className="text-green-500">→</div>
                    <div className="text-lg font-semibold">{route.to}</div>
                  </div>
                  <div className="mb-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {route.service}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <div>Starts from {route.price}</div>
                    <div>Duration: {route.time}</div>
                  </div>
                  <div className="text-xs text-gray-500 mb-4">{route.stops}</div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      dispatch(setSearchParams({
                        origin: route.from,
                        destination: route.to,
                        date: searchParams.date || new Date().toISOString().split('T')[0]
                      }));
                      navigate("/search");
                    }}
                  >
                    View Schedules
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-green-800 py-8 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Eco Bus Company</h3>
              <p className="text-white">
                Your trusted partner for safe and comfortable travel along the Kampala Juba Highway. 
                Connecting Kampala, Gulu, Elegu, and Juba with reliable bus services.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Our Stops</h3>
              <ul className="space-y-2">
                <li><span className="text-white">Kampala, Uganda</span></li>
                <li><span className="text-white">Gulu, Uganda</span></li>
                <li><span className="text-white">Elegu, Uganda</span></li>
                <li><span className="text-white">Juba, South Sudan</span></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Contact</h3>
              <ul className="space-y-2 text-white">
                <li>Email: bookings@ecobus.com</li>
                <li>Phone: +256 700 123 456</li>
                <li>Address: Central Bus Terminal, Kampala, Uganda</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-green-700 mt-8 pt-6 text-center text-white">
            <p>© {new Date().getFullYear()} Eco Bus Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
