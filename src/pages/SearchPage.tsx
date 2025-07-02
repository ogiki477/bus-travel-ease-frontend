/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setSearchParams, selectBus, Bus } from "@/store/slices/bookingSlice";

import { fetchRoutes } from "@/store/slices/routeSlice";
import { fetchAllBuses } from "@/store/slices/busSlice";
import { fetchSchedules, clearSchedules, Schedule } from "@/store/slices/scheduleSlice";
import { BUS_PIC_BASE } from "@/store/apiConfig";
import Spinner from "./Spinner";

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [userSearched, setUserSearched] = useState(false);

  const { searchParams } = useAppSelector((s) => s.booking);
  const { schedules, isLoading: schedLoading } = useAppSelector(
    (s) => s.schedule
  );
  const { buses, isLoading: busLoading } = useAppSelector((s) => s.bus);
  const { routes, isLoading: routeLoading } = useAppSelector(
    (s) => s.routes
  );

  const uniqueOrigins = useMemo(
  () => Array.from(new Set(routes.map((r) => r.origin))),
  [routes],
    );
    const uniqueDestinations = useMemo(
      () => Array.from(new Set(routes.map((r) => r.destination))),
      [routes],
    );

  // 1) load dropdowns + full bus list, and clear old schedules
  useEffect(() => {
    dispatch(fetchRoutes());
    dispatch(fetchAllBuses());
    dispatch(clearSchedules());
  }, [dispatch]);

  // 2) whenever origin & destination are set, auto-search
  useEffect(() => {
    if (searchParams.origin && searchParams.destination) {
      setUserSearched(true);
      dispatch(
        fetchSchedules({
          origin: searchParams.origin,
          destination: searchParams.destination,
          date: searchParams.date || undefined,
        })
      );
    }
  }, [dispatch, searchParams.origin, searchParams.destination, searchParams.date]);

  const handleSearch = () => {
    if (!searchParams.origin || !searchParams.destination) {
      return toast({
        title: "Search Error",
        description: "Please select both origin and destination",
        variant: "destructive",
      });
    }
    // you could also re‐fetch on date changes here
    setUserSearched(true);
    dispatch(
      fetchSchedules({
        origin: searchParams.origin,
        destination: searchParams.destination,
        date: searchParams.date || undefined,
      })
    );
  };

  // 3) client‐side refine exact-match
  const filteredSchedules = useMemo(() => {
    if (!userSearched) return [];
    return schedules.filter(
      (s) =>
        s.route.origin.toLowerCase() ===
          searchParams.origin.toLowerCase() &&
        s.route.destination.toLowerCase() ===
          searchParams.destination.toLowerCase()
    );
  }, [schedules, searchParams, userSearched]);

  // 4) what to show: before search → all buses | after → schedules
  const displayList = userSearched ? filteredSchedules : buses;

  if (routeLoading || busLoading || schedLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="container mx-auto py-8 px-4">
        {/* Search form */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Find Your Bus
          </h1>
          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Origin */}
                <div>
                  <label className="block text-sm text-gray-600">From</label>
                  <Select
                    value={searchParams.origin}
                    onValueChange={(v) =>
                      dispatch(
                        setSearchParams({ ...searchParams, origin: v })
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueOrigins.map((origin) => (
                        <SelectItem key={origin} value={origin}>
                          {origin}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm text-gray-600">To</label>
                  <Select
                    value={searchParams.destination}
                    onValueChange={(v) =>
                      dispatch(
                        setSearchParams({
                          ...searchParams,
                          destination: v,
                        })
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueDestinations.map((destination) => (
                        <SelectItem key={destination} value={destination}>
                          {destination}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm text-gray-600">Date</label>
                  <input
                    type="date"
                    className="w-full h-10 px-3 rounded-md border border-gray-300"
                    value={searchParams.date}
                    onChange={(e) =>
                      dispatch(
                        setSearchParams({
                          ...searchParams,
                          date: e.target.value,
                        })
                      )
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    className="w-full bg-bus-primary hover:bg-blue-700"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {userSearched && filteredSchedules.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            No buses available for{" "}
            <strong>
              {searchParams.origin} → {searchParams.destination}
            </strong>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {displayList.map((item: any) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  {/* picture */}
                  {(
                    item.bus_pic ||
                    item.bus?.bus_pic
                  ) && (
                    <img
                      src={`${BUS_PIC_BASE}/${
                        item.bus_pic || item.bus.bus_pic
                      }`}
                      className="w-full h-32 object-cover rounded mb-2"
                      alt={
                        item.name ||
                        `${item.route.origin}→${item.route.destination}`
                      }
                    />
                  )}

                  {/* bare bus */}
                  {"name" in item && (
                    <h2 className="text-xl font-bold">
                      {item.name}
                    </h2>
                  )}
                  {"number_plate" in item && (
                    <p>Number Plate: {item.number_plate}</p>
                  )}
                  {"total_seats" in item && (
                    <p>Seats: {item.total_seats}</p>
                  )}
                  {"amenities" in item && (
                    <p>Customer Care: {item.amenities}</p>
                  )}

                  {/* schedule */}
                  {"departure_time" in item &&
                    item.bus &&
                    item.route && (
                      <>
                        <h2 className="text-xl font-bold">
                          {item.route.origin} →{" "}
                          {item.route.destination}
                        </h2>
                        <p>
                          Departs:{" "}
                          {new Date(
                            item.departure_time
                          ).toLocaleString()}
                        </p>
                        <p>
                          Arrives:{" "}
                          {new Date(
                            item.arrival_time
                          ).toLocaleString()}
                        </p>
                        <p>
                          Price:{" "}
                          {new Intl.NumberFormat(
                            "en-UG",
                            {
                              style: "currency",
                              currency: "UGX",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          ).format(
                            Number(item.route.base_price)
                          )}
                        </p>
                        <div className="mt-2 flex justify-end">
                            <Button
                              onClick={() => {
                                const s = item as Schedule;
                                const busData: Bus = {
                                  id: String(s.id),
                                  routeName: `${s.route.origin} → ${s.route.destination}`,
                                  origin: s.route.origin,
                                  destination: s.route.destination,
                                  departureTime: new Date(s.departure_time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }),
                                  arrivalTime: new Date(s.arrival_time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }),
                                  // new fields:
                                  departureFull: s.departure_time,
                                  arrivalFull: s.arrival_time,
                                  price: parseFloat(s.route.base_price),
                                  availableSeats: s.bus.total_seats,
                                  busNumber: s.bus.number_plate,
                                  companyName: s.bus.name,
                                  busPic: s.bus.bus_pic,
                                };
                                // persist
                                localStorage.setItem("selectedBus", JSON.stringify(busData));
                                dispatch(selectBus(busData));
                                navigate(`/seat-selection/${s.id}`);
                              }}
                            >
                              Select Seats
                            </Button>

                        </div>
                      </>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
