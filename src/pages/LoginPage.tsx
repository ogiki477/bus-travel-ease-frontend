// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { loginUser } from "@/store/slices/authSlice"; // ← correct import

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Get the returnUrl from the location state or default to "/"
  const from =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof (location.state as { from?: { pathname?: string } }).from === "object" &&
    (location.state as { from?: { pathname?: string } }).from !== null &&
    "pathname" in (location.state as { from?: { pathname?: string } }).from!
      ? ((location.state as { from: { pathname: string } }).from.pathname)
      : "/";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Dispatch the loginUser thunk
      const result = await dispatch(
        loginUser({ email: formData.email, password: formData.password })
      );

      if (loginUser.fulfilled.match(result)) {
        toast({
          title: "Login Successful",
          description: "You have been successfully logged in",
        });
        // Navigate to the page they were trying to access or home
        navigate(from, { replace: true });
      } else {
        // If we land here, loginUser was rejected or returned a payload error
        const errorMsg =
          result.payload && typeof result.payload === "string"
            ? result.payload
            : "Invalid email or password. Please try again.";
        toast({
          title: "Login Failed",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
      console.error("Login error:", err);
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
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="#" className="text-sm text-bus-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
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

              <Button
                type="submit"
                className="w-full bg-bus-primary hover:bg-bus-dark transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-gray-500">
                For admin access, use an email with "admin" in it (e.g., admin@example.com)
              </span>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <div className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-bus-primary font-medium hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
