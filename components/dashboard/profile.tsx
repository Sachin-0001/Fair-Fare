// FILE: pages/driver/profile.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarDrive } from "@/components/dashboard/driverside";
import axios from "axios";

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch user data from the database
  useEffect(() => {
    const fetchUserData = async () => {
      // try {
      //   setLoading(true);
      //   // const response = await axios.get("/api/user/profile"); // Replace with your API endpoint
      //   setFormData({
      //     fullName: response.data.fullName || "",
      //     email: response.data.email || "",
      //     phoneNumber: response.data.phoneNumber || "",
      //     password: "", // Password is not fetched for security reasons
      //   });
      // } catch (error) {
      //   console.error("Error fetching user data:", error);
      // } finally {
      //   setLoading(false);
      // }
    };

    fetchUserData();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put("/api/user/profile", formData); // Replace with your API endpoint
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <SidebarDrive />
      <div className="ml-64 p-4 w-full bg-gray-50 text-black">
        <div className="flex flex-col items-center">
          <Card className="w-full md:w-2/3 lg:w-1/2 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Profile Settings</h2>
              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <Input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <Input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+1234567890"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="********"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md shadow-md"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;