import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleSeatSelection, createBooking, selectBus, Bus } from "@/store/slices/bookingSlice";
import { getSeats } from "@/store/thunks/bookingThunks";
import { BUS_PIC_BASE } from "@/store/apiConfig";
import Spinner from "./Spinner";

const SeatSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { busId } = useParams<{ busId: string }>();
  const dispatch = useAppDispatch();
  const { selectedBus, seats } = useAppSelector((s) => s.booking);
  const { toast } = useToast();
  const [passengerDetails, setPassengerDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // on mount or bus change, load seats
  useEffect(() => {
  if (busId) {
    const saved = localStorage.getItem("selectedBus");
    if (saved && (!selectedBus || selectedBus.id !== busId)) {
      const busData: Bus = JSON.parse(saved);
      dispatch(selectBus(busData));
    }
    // ALWAYS fetch seats, even if you loaded selectedBus from localStorage
    dispatch(getSeats(busId));
  } else {
    navigate("/search");
  }
}, [busId, dispatch, navigate, selectedBus]);

  // Show loader until selectedBus is populated
  if (!selectedBus) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner loading />
      </div>
    );
  }

  // which seats are selected
  const selectedSeats = seats.filter((s) => s.isSelected);
  // per-seat fare from selectedBus.price; total = price * count
  const farePerSeat = selectedBus?.price ?? 0;
  const totalAmount = farePerSeat * selectedSeats.length;

  const fmt = (value: number) =>
    new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPassengerDetails((p) => ({ ...p, [name]: value }));
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

    const { name, email, phone } = passengerDetails;
    if (!name || !email || !phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all passenger details",
        variant: "destructive",
      });
      return;
    }

    dispatch(createBooking(passengerDetails));
    navigate("/booking-confirmation");
  };

  // seat map splitter
  const renderSeatMap = () => {
    const rows: typeof seats[] = [];
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
            {rows.map((row, ri) => (
              <div key={ri} className="flex space-x-3 md:space-x-4">
                {row.map((seat, si) => {
                  if (si === 2) {
                    return (
                      <div
                        key={`aisle-${ri}-${si}`}
                        className="w-10 h-10"
                      />
                    );
                  }
                  const base =
                    !seat.isAvailable
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : seat.isSelected
                      ? "bg-bus-primary text-white"
                      : "bg-white border border-bus-primary text-bus-primary hover:bg-bus-primary/10";
                  return (
                    <button
                      key={seat.id}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-md flex items-center justify-center font-medium transition-colors ${base}`}
                      disabled={!seat.isAvailable}
                      onClick={() =>
                        seat.isAvailable &&
                        dispatch(toggleSeatSelection(seat.id))
                      }
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
          <Legend color="white" label="Available" />
          <Legend color="bus-primary" label="Selected" />
          <Legend color="gray-300" label="Booked" />
        </div>
      </div>
    );
  };

  //if (!selectedBus) return null; // or a loader

  

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

          <h1 className="text-3xl font-bold text-gray-800">
            Select Your Seats
          </h1>
          <p className="text-gray-600 mt-2">
            {selectedBus.routeName} • {selectedBus.departureTime} •{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Bus Seat Map</CardTitle>
              </CardHeader>
              <CardContent>{renderSeatMap()}</CardContent>
            </Card>
          </div>

          {/* Booking summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    {selectedBus.busPic && (
                      <div className="col-span-2">
                        <img
                          src={`${BUS_PIC_BASE}/${selectedBus.busPic}`}
                          alt={selectedBus.companyName}
                          className="w-full h-32 object-cover rounded mb-4"
                        />
                      </div>
                    )}

                    {/* Bus Name */}
                    <Detail label="Bus" value={selectedBus.companyName} />
                    <Detail label="Plate" value={selectedBus.busNumber} />

                    {/* From / To */}
                    <Detail label="From" value={selectedBus.origin} />
                    <Detail label="To" value={selectedBus.destination} />

                    {/* Departs full date/time */}
                    <Detail
                      label="Departs"
                      value={
                        selectedBus.departureFull
                          ? new Date(selectedBus.departureFull).toLocaleString()
                          : selectedBus.departureTime
                      }
                    />
                    {/* Arrives full date/time */}
                    <Detail
                      label="Arrives"
                      value={
                        selectedBus.arrivalFull
                          ? new Date(selectedBus.arrivalFull).toLocaleString()
                          : selectedBus.arrivalTime
                      }
                    />

                    {/* Seats */}
                    <div>
                      <div className="text-sm text-gray-500">Selected Seats</div>
                      <div className="font-medium">
                        {selectedSeats.length > 0
                          ? selectedSeats.map((s) => s.number).join(", ")
                          : "None"}
                      </div>
                    </div>

                    {/* Fare per seat */}
                    <Detail label="Fare per seat" value={fmt(farePerSeat)} />

                    {/* Total */}
                    <div className="col-span-2 pt-4 border-t">
                      <div className="flex justify-between text-lg font-bold">
                        <div>Total</div>
                        <div>{fmt(totalAmount)}</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        for {selectedSeats.length} seat
                        {selectedSeats.length !== 1 && "s"}
                      </div>
                    </div>
                  </div>

                {/* Passenger form */}
                <div className="mt-6 space-y-4">
                  <h3 className="font-medium">Passenger Details</h3>
                  <InputField
                    label="Full Name"
                    name="name"
                    value={passengerDetails.name}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Email"
                    name="email"
                    value={passengerDetails.email}
                    onChange={handleInputChange}
                    type="email"
                  />
                  <InputField
                    label="Phone Number"
                    name="phone"
                    value={passengerDetails.phone}
                    onChange={handleInputChange}
                    type="tel"
                  />
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
    </div>
  );
};

export default SeatSelectionPage;

// small helpers
function Legend({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  const bg =
    color === "bus-primary" ? "bg-bus-primary" : `bg-${color}`;
  return (
    <div className="flex items-center">
      <div className={`${bg} w-6 h-6 mr-2 rounded`}></div>
      <span className="text-sm">{label}</span>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-10 px-3 mt-1 rounded-md border border-gray-300"
      />
    </div>
  );
}
