import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleSeatSelection, createBooking } from "@/store/slices/bookingSlice";
import { getSeats } from "@/store/thunks/bookingThunks";

const SeatSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { busId } = useParams<{ busId: string }>();
  const dispatch = useAppDispatch();
  const { selectedBus, seats } = useAppSelector((state) => state.booking);
  const { toast } = useToast();
  const [passengerDetails, setPassengerDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  
  useEffect(() => {
    // If no bus is selected or bus ID doesn't match URL param, fetch seats for this bus
    if (!selectedBus || selectedBus.id !== busId) {
      // Redirect to search page if busId is invalid
      if (!busId) {
        navigate("/search");
        return;
      }
      
      // Load seats for this bus
      dispatch(getSeats(busId));
    }
  }, [busId, selectedBus, dispatch, navigate]);

  const selectedSeats = seats.filter((seat) => seat.isSelected);
  const totalAmount = selectedBus ? selectedBus.price * selectedSeats.length : 0;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassengerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to continue",
        variant: "destructive",
      });
      return;
    }

    if (!passengerDetails.name || !passengerDetails.email || !passengerDetails.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all passenger details",
        variant: "destructive",
      });
      return;
    }

    // Create the booking
    dispatch(createBooking(passengerDetails));
    navigate("/booking-confirmation");
  };

  // Generate a grid of seats (5 columns x 8 rows for a typical bus)
  const renderSeatMap = () => {
    // Group seats into rows of 5 (common bus layout: 2 seats | aisle | 3 seats)
    const rows = [];
    for (let i = 0; i < seats.length; i += 5) {
      rows.push(seats.slice(i, i + 5));
    }

    return (
      <div className="mt-6">
        <div className="flex justify-center mb-8">
          <div className="bg-gray-300 rounded-t-xl w-3/4 h-16 flex items-center justify-center font-medium text-gray-700">
            Driver's Cabin
          </div>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="space-y-4">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex space-x-3 md:space-x-4">
                {row.map((seat, seatIndex) => {
                  // Add an empty space in the middle (aisle)
                  const isAisle = seatIndex === 2;
                  
                  if (isAisle) {
                    return <div key={`aisle-${rowIndex}-${seatIndex}`} className="w-10 h-10"></div>;
                  }
                  
                  return (
                    <button
                      key={seat.id}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-md flex items-center justify-center font-medium transition-colors
                        ${
                          !seat.isAvailable
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : seat.isSelected
                            ? "bg-bus-primary text-white"
                            : "bg-white border border-bus-primary text-bus-primary hover:bg-bus-primary/10"
                        }`}
                      onClick={() => seat.isAvailable && dispatch(toggleSeatSelection(seat.id))}
                      disabled={!seat.isAvailable}
                    >
                      {seat.number}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center items-center space-x-8">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white border border-bus-primary mr-2"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-bus-primary mr-2"></div>
            <span className="text-sm">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-300 mr-2"></div>
            <span className="text-sm">Booked</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => navigate("/search")}
          >
            ← Back to Search Results
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-800">Select Your Seats</h1>
          {selectedBus && (
            <p className="text-gray-600 mt-2">
              {selectedBus.routeName} • {selectedBus.departureTime} • {new Date().toLocaleDateString()}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Bus Seat Map</CardTitle>
              </CardHeader>
              <CardContent>
                {renderSeatMap()}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedBus && (
                    <>
                      <div>
                        <div className="text-sm text-gray-500">Bus</div>
                        <div className="font-medium">{selectedBus.companyName}</div>
                        <div className="text-sm">{selectedBus.busNumber}</div>
                      </div>
                      
                      <div className="flex justify-between">
                        <div>
                          <div className="text-sm text-gray-500">From</div>
                          <div className="font-medium">{selectedBus.origin}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">To</div>
                          <div className="font-medium">{selectedBus.destination}</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <div>
                          <div className="text-sm text-gray-500">Departure</div>
                          <div className="font-medium">{selectedBus.departureTime}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Arrival</div>
                          <div className="font-medium">{selectedBus.arrivalTime}</div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <div className="text-sm text-gray-500">Selected Seats</div>
                    {selectedSeats.length > 0 ? (
                      <div className="font-medium">
                        {selectedSeats.map(seat => seat.number).join(", ")}
                      </div>
                    ) : (
                      <div className="text-orange-500">No seats selected</div>
                    )}
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Fare</div>
                    <div className="font-medium">{selectedBus ? formatPrice(selectedBus.price) : "N/A"} per seat</div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-lg font-bold">
                      <div>Total</div>
                      <div>{formatPrice(totalAmount)}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      for {selectedSeats.length} seat(s)
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <h3 className="font-medium">Passenger Details</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        className="w-full h-10 px-3 mt-1 rounded-md border border-gray-300"
                        placeholder="Enter your full name"
                        value={passengerDetails.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="w-full h-10 px-3 mt-1 rounded-md border border-gray-300"
                        placeholder="Enter your email address"
                        value={passengerDetails.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-500">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full h-10 px-3 mt-1 rounded-md border border-gray-300"
                        placeholder="Enter your phone number"
                        value={passengerDetails.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-bus-secondary hover:bg-orange-600"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <footer className="mt-auto bg-gray-800 text-white py-4 px-6">
        <div className="container mx-auto text-center text-gray-400">
          <p>© {new Date().getFullYear()} UgandaBus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SeatSelectionPage;
