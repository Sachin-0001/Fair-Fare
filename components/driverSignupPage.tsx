"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/driver/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          licenseNumber: licenseNumber,
          vehicleNumber: vehicleNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/driver/dashboard");
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
    };
    const handleGoBack = () => {
        router.push("/"); // Redirect to the landing page
      };

  return (
    <section className="bg-white">
          <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <div className="absolute top-4 left-4">
          <button
            onClick={handleGoBack}
            className="bg-gray-200 text-black py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Go Back
          </button>
        </div>

        {/* Sidebar with Image */}
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Signup Illustration"
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        {/* Main Content */}
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl p-24 lg:max-w-3xl">
            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Create Your Driver Account 🚗
            </h1>
            <p className="mt-4 leading-relaxed text-gray-500">
              Enter your details to create your driver account and start your journey with FairFare.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="bg-red-100 border-red-400 text-red-700">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Input */}
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-black">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  className="mt-1 block w-full rounded-md border-gray-700 text-black shadow-sm focus:border-black focus:ring-black"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-black">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  className="mt-1 block w-full rounded-md border-gray-700 text-black shadow-sm focus:border-black focus:ring-black"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  className="mt-1 block w-full rounded-md border-gray-700 text-black shadow-sm focus:border-black focus:ring-black"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* License Number Input */}
              <div>
                <Label htmlFor="licenseNumber" className="block text-sm font-medium text-black">
                  License Number
                </Label>
                <Input
                  id="licenseNumber"
                  type="text"
                  value={licenseNumber}
                  className="mt-1 block w-full rounded-md border-gray-700 text-black shadow-sm focus:border-black focus:ring-black"
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="Enter your license number"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Vehicle Number Input */}
              <div>
                <Label htmlFor="vehicleNumber" className="block text-sm font-medium text-black">
                  Vehicle Number
                </Label>
                <Input
                  id="vehicleNumber"
                  type="text"
                  value={vehicleNumber}
                  className="mt-1 block w-full rounded-md border-gray-700 text-black shadow-sm focus:border-black focus:ring-black"
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="Enter your vehicle number"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-black">
                Already have an account?{" "}
                <Link href="./login" className="font-medium text-black hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}

export default SignupPage;