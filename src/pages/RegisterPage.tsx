// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/store/hooks";
import { registerUser } from "@/store/slices/authSlice";

const phoneRegex = /^\+?\d{9,15}$/;

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || phoneRegex.test(val),
        "Phone must be 9–15 digits, optionally starting with '+'"
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Zod validation
    try {
      registerSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const firstIssue = err.errors[0];
        toast({
          title: "Validation Error",
          description: firstIssue.message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      const result = await dispatch(registerUser(formData));

      if (registerUser.fulfilled.match(result)) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully",
        });
        navigate("/");
      } else {
        const errorMsg =
          result.payload && typeof result.payload === "string"
            ? result.payload
            : "Failed to create account. Please try again.";
        toast({
          title: "Registration Failed",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-12"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1705601456582-7177f3868f8b?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundColor: "rgba(0,0,0,0.5)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center mb-8 text-white">
          <span className="mr-2 text-3xl">🚌</span>
          <span className="text-3xl font-bold drop-shadow-md">EcoBus</span>
        </Link>

        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-bus-primary">
              Join EcoBus
            </CardTitle>
            <CardDescription className="text-center">
              Create your account to start booking bus tickets
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-white/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+256 700 123 456"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-white/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-white/50"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-bus-primary hover:bg-bus-dark transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Create Account"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <div className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-bus-primary font-medium hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
