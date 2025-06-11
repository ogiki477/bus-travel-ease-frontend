import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, DollarSign, Phone, Loader2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { resetBooking } from "@/store/slices/bookingSlice";

const BookingConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { booking, selectedBus } = useAppSelector((state) => state.booking);
  const { toast } = useToast();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  
  useEffect(() => {
    // If there's no booking data, redirect to home
    if (!booking || !selectedBus) {
      toast({
        title: "No booking found",
        description: "Please search and select a bus to book tickets",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    
    // If already paid, show success toast
    if (isPaid) {
      toast({
        title: "Booking Successful!",
        description: `Your booking (${booking.bookingId}) has been confirmed.`,
      });
    }
  }, [booking, selectedBus, isPaid, toast, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-UG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePrint = () => {
    if (ticketRef.current) {
      const content = ticketRef.current.innerHTML;
      const printWindow = window.open("", "_blank");
      
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Bus Ticket - ${booking?.bookingId}</title>
              <style>
                body { font-family: Arial, sans-serif; color: #333; }
                .ticket { max-width: 800px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; margin-bottom: 20px; }
                .logo { font-size: 24px; font-weight: bold; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .info-item { margin-bottom: 10px; }
                .label { font-size: 12px; color: #666; }
                .value { font-weight: bold; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                @media print {
                  @page { size: A4; margin: 10mm; }
                }
              </style>
            </head>
            <body>
              <div class="ticket">
                ${content}
                <div class="footer">
                  <p>Thank you for choosing UgandaBus!</p>
                  <p>For customer support, please call +256 700 123 456 or email support@ugandabus.com</p>
                </div>
              </div>
              <script>
                window.onload = function() { window.print(); window.close(); }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const handleBookAnother = () => {
    dispatch(resetBooking());
    navigate("/");
  };
  
  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      
      toast({
        title: "Payment Successful!",
        description: `Payment of ${formatPrice(booking!.totalAmount)} completed via ${getPaymentMethodName()}.`,
      });
    }, 2000);
  };
  
  const getPaymentMethodName = () => {
    switch(paymentMethod) {
      case "card": return "Credit/Debit Card";
      case "momo": return "Mobile Money";
      case "paypal": return "PayPal";
      default: return "Credit/Debit Card";
    }
  };

  // If no booking data, show blank page (useEffect will redirect)
  if (!booking || !selectedBus) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {!isPaid ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800">Complete Your Payment</h1>
                <p className="text-gray-600 mt-2">
                  Please select a payment method to complete your booking
                </p>
              </div>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Select Payment Method</h3>
                      <RadioGroup 
                        defaultValue="card" 
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3"
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                      >
                        <div className={`relative rounded-md border p-4 cursor-pointer flex gap-2 items-center ${paymentMethod === 'card' ? 'border-bus-primary bg-bus-primary/5' : ''}`}>
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                            <CreditCard size={18} />
                            <span>Credit/Debit Card</span>
                          </Label>
                        </div>
                        <div className={`relative rounded-md border p-4 cursor-pointer flex gap-2 items-center ${paymentMethod === 'momo' ? 'border-bus-primary bg-bus-primary/5' : ''}`}>
                          <RadioGroupItem value="momo" id="momo" />
                          <Label htmlFor="momo" className="flex items-center gap-2 cursor-pointer">
                            <Phone size={18} />
                            <span>Mobile Money</span>
                          </Label>
                        </div>
                        <div className={`relative rounded-md border p-4 cursor-pointer flex gap-2 items-center ${paymentMethod === 'paypal' ? 'border-bus-primary bg-bus-primary/5' : ''}`}>
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                            <DollarSign size={18} />
                            <span>PayPal</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {paymentMethod === "card" && (
                      <div className="grid gap-4">
                        <div>
                          <label className="text-sm text-gray-500">Card Number</label>
                          <input
                            type="text"
                            className="w-full h-10 px-3 mt-1 rounded-md border border-gray-300"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-500">Expiry Date</label>
                            <input
                              type="text"
                              className="w-full h-10 px-3 mt-1 rounded-md border border-gray-300"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">CVV</label>
                            <input
                              type="text"
                              className="w-full h-10 px-3 mt-1 rounded-md border border-gray-300"
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === "momo" && (
                      <div className="grid gap-4">
                        <div>
                          <label className="text-sm text-gray-500">Mobile Money Number</label>
                          <input
                            type="text"
                            className="w-full h-10 px-3 mt-1 rounded-md border border-gray-300"
                            placeholder="0700 123456"
                          />
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === "paypal" && (
                      <div className="text-center p-4 bg-blue-50 rounded-md">
                        <p>You'll be redirected to PayPal to complete your payment.</p>
                      </div>
                    )}
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span>Amount to pay:</span>
                        <span className="text-xl font-bold">{formatPrice(booking.totalAmount)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.selectedSeats.length} seat(s) × {formatPrice(selectedBus.price)}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-bus-secondary hover:bg-orange-600"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay ${formatPrice(booking.totalAmount)}`
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Booking Confirmed!</h1>
                <p className="text-gray-600 mt-2">
                  Your booking has been confirmed and your tickets are ready.
                </p>
              </div>
              
              <div ref={ticketRef}>
                <Card className="border-2 border-bus-primary mb-6">
                  <CardHeader className="bg-bus-primary text-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl">UgandaBus E-Ticket</CardTitle>
                        <p className="text-blue-100 mt-1">Your journey is confirmed</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-blue-100">Booking ID</div>
                        <div className="text-xl font-mono">{booking.bookingId}</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium text-lg mb-4">Journey Details</h3>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-gray-500">Route</div>
                            <div className="font-medium">{selectedBus.routeName}</div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-500">From</div>
                              <div className="font-medium">{selectedBus.origin}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">To</div>
                              <div className="font-medium">{selectedBus.destination}</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-500">Date</div>
                              <div className="font-medium">{formatDate(booking.travelDate)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Bus Number</div>
                              <div className="font-medium">{selectedBus.busNumber}</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-500">Departure</div>
                              <div className="font-medium">{selectedBus.departureTime}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Arrival</div>
                              <div className="font-medium">{selectedBus.arrivalTime}</div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-500">Operator</div>
                            <div className="font-medium">{selectedBus.companyName}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg mb-4">Passenger Details</h3>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-gray-500">Name</div>
                            <div className="font-medium">{booking.passengerName}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-500">Email</div>
                            <div className="font-medium">{booking.passengerEmail}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-500">Phone</div>
                            <div className="font-medium">{booking.passengerPhone}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-500">Seat(s)</div>
                            <div className="font-medium">
                              {booking.selectedSeats.join(", ")}
                            </div>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="text-sm text-gray-500 mb-1">Total Amount</div>
                          <div className="text-2xl font-bold text-bus-secondary">
                            {formatPrice(booking.totalAmount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.selectedSeats.length} seat(s) × {formatPrice(selectedBus.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 border-t pt-6">
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                        <h4 className="font-medium text-amber-800 mb-2">Important Information:</h4>
                        <ul className="text-sm text-amber-700 space-y-1">
                          <li>• Please arrive at the bus station at least 30 minutes before departure.</li>
                          <li>• Present this e-ticket (printed or digital) at the boarding point.</li>
                          <li>• Carry a valid ID card for verification.</li>
                          <li>• Each passenger is allowed one piece of luggage (max 20kg).</li>
                          <li>• For cancellations, please contact our customer support at least 24 hours prior to departure.</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <Button 
                  className="flex-1 bg-bus-primary hover:bg-blue-700"
                  onClick={handlePrint}
                >
                  Print Ticket
                </Button>
                <Button 
                  className="flex-1 bg-bus-secondary hover:bg-orange-600"
                  onClick={handleBookAnother}
                >
                  Book Another Ticket
                </Button>
              </div>
            </>
          )}
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

export default BookingConfirmationPage;
