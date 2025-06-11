import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setSearchParams, searchBuses, selectBus } from "@/store/slices/bookingSlice";

const locations = ["Kampala", "Gulu", "Elegu", "Juba"];

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { searchParams, foundBuses } = useAppSelector((state) => state.booking);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(searchBuses());
  }, [dispatch]);

  const handleSearch = (): void => {
    if (searchParams.origin && searchParams.destination) {
      dispatch(searchBuses());
    } else {
      toast({
        title: "Search Error",
        description: "Please select both origin and destination",
        variant: "destructive",
      });
    }
  };

  const handleSelectBus = (bus: typeof foundBuses[number]): void => {
    dispatch(selectBus(bus));
    navigate(`/seat-selection/${bus.id}`);
  };

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Your Bus</h1>

          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">From</label>
                  <Select
                    value={searchParams.origin}
                    onValueChange={(value) =>
                      dispatch(setSearchParams({ ...searchParams, origin: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">To</label>
                  <Select
                    value={searchParams.destination}
                    onValueChange={(value) =>
                      dispatch(setSearchParams({ ...searchParams, destination: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
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
                    onChange={(e) =>
                      dispatch(setSearchParams({ ...searchParams, date: e.target.value }))
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    className="w-full bg-bus-primary hover:bg-blue-700"
                    onClick={handleSearch}
                  >
                    Search Buses
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {foundBuses.length > 0
                ? `${foundBuses.length} Buses Found`
                : "No Buses Found"}
            </h2>

            {searchParams.origin && searchParams.destination && (
              <div className="text-lg font-medium text-gray-600">
                {searchParams.origin} to {searchParams.destination}
                {searchParams.date &&
                  ` • ${new Date(searchParams.date).toLocaleDateString()}`}
              </div>
            )}
          </div>

          {foundBuses.length > 0 ? (
            <div className="space-y-4">
              {foundBuses.map((bus) => (
                <Card
                  key={bus.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-bus-primary">
                            {bus.routeName}
                          </h3>
                          <p className="text-gray-500">
                            {bus.companyName} • Bus #{bus.busNumber}
                          </p>
                          {bus.stops?.length && (
                            <p className="text-sm text-gray-400 mt-1">
                              Stops: {bus.stops.join(", ")}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-bus-secondary">
                            {formatPrice(bus.price)}
                          </div>
                          <p className="text-sm text-gray-500">per person</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Departure</div>
                          <div className="font-medium">{bus.departureTime}</div>
                          <div className="text-gray-700">{bus.origin}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Arrival</div>
                          <div className="font-medium">{bus.arrivalTime}</div>
                          <div className="text-gray-700">{bus.destination}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Available Seats</div>
                          <div className="font-medium">{bus.availableSeats}</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="p-4 bg-gray-50 flex justify-end">
                      <Button
                        className="bg-bus-primary hover:bg-blue-700"
                        onClick={() => handleSelectBus(bus)}
                      >
                        Select Seats
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white p-8 text-center">
              <div className="text-5xl mb-4">🚌</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No buses found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchParams.origin && searchParams.destination
                  ? "We couldn't find any buses for that route."
                  : "Select origin & destination to search."}
              </p>
              <Button
                className="bg-bus-primary hover:bg-blue-700"
                onClick={() => navigate("/")}
              >
                Return to Home
              </Button>
            </Card>
          )}
        </div>
      </div>

      <footer className="mt-auto bg-gray-800 text-white py-4 px-6">
        <div className="container mx-auto text-center text-gray-400">
          <p>© {new Date().getFullYear()} Eco Bus Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;
