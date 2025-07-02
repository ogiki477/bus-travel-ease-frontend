// src/pages/BookingConfirmationPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, DollarSign, Phone, Loader2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { createBooking, resetBooking } from "@/store/slices/bookSlice";
import { BASE_URL } from "@/store/apiConfig";

const BookingConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { booking: createdBooking, isLoading, error } = useAppSelector((s) => s.book);
  const { toast } = useToast();

  // Context from selection
  const selectedBus = useAppSelector((s) => s.booking.selectedBus)!;
  const bookingDetails = useAppSelector((s) => s.booking.booking)!;

  const [paymentMethod, setPaymentMethod] = useState("card");

  // Redirect without context
  useEffect(() => {
    if (!selectedBus || !bookingDetails) {
      toast({ title: "Incomplete booking", description: "Please start from search", variant: "destructive" });
      navigate("/search");
    }
  }, [selectedBus, bookingDetails, navigate, toast]);

  // On success / error
  useEffect(() => {
    if (createdBooking) {
      // Open the generated PDF in new tab
      const pdfUrl = `${BASE_URL}/bookings/generate_pdf/${createdBooking.id}`;
      window.open(pdfUrl, "_blank");

      // Show success toast
      toast({ title: "Booking Confirmed!", description: "Check your email for your e-ticket." });

      // reset and redirect home
      dispatch(resetBooking());
      navigate("/search");
    }
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    }
  }, [createdBooking, error, navigate, toast, dispatch]);

  const handlePayment = () => {
    dispatch(
      createBooking({
        schedule_id: Number(selectedBus.id),
        payment_method: paymentMethod,
        price: bookingDetails.totalAmount,
      })
    );
  };

  if (!selectedBus || !bookingDetails) return null;

  const amount = new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    minimumFractionDigits: 0,
  }).format(bookingDetails.totalAmount);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader><CardTitle>Complete Your Payment</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="grid grid-cols-3 gap-4"
            >
              {['card','momo','paypal'].map((method) => (
                <div key={method} className={`p-4 border rounded ${paymentMethod===method?'border-bus-primary':''}`}>
                  <RadioGroupItem value={method} id={method} />
                  <Label htmlFor={method} className="ml-2 capitalize">{method}</Label>
                </div>
              ))}
            </RadioGroup>

            <div className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-bold">{amount}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-bus-secondary hover:bg-orange-600"
            >
              {isLoading
                ? <Loader2 className="animate-spin mr-2 h-4 w-4" />
                : `Pay ${amount}`}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
