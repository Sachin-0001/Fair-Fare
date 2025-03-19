"use client";
import React, { useState, useEffect } from "react";
import { FaRupeeSign, FaTimes } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Progress from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Car, DollarSign, History, Settings ,Star} from "lucide-react";
import { BasicSidebar } from "@/components/dashboard/dashboard-sidebar"
import { SidebarDrive } from "./driverside";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const earningsData = [
  { day: "Mon", earnings: 50 },
  { day: "Tue", earnings: 70 },
  { day: "Wed", earnings: 65 },
  { day: "Thu", earnings: 90 },
  { day: "Fri", earnings: 120 },
  { day: "Sat", earnings: 200 },
  { day: "Sun", earnings: 150 },
];

const userReviews = [
  {
    name: "John Doe",
    review: "Great driver! Very professional and friendly.",
    rating: 5,
  },
  {
    name: "Jane Smith",
    review: "Smooth ride and very punctual.",
    rating: 4,
  },
  {
    name: "Alice Johnson",
    review: "Good experience, but the car could be cleaner.",
    rating: 3,
  },
];
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const DriverDashboard = () => {
  interface Ride {
    _id: string; // Added id property
    currentLocation: string;
    destination: string;
    distanceKm: number; // Added distanceKm property
    fare: number;
    predictedPrice: number; // Added predictedPrice property
  }

  const [liveRides, setLiveRides] = useState<Ride[]>([]); // State to store live ride requests
  const [loading, setLoading] = useState(true); // State to handle loading
  const [popupVisible, setPopupVisible] = useState(false);
  const [popup1Visible, setPopup1Visible] = useState(false);
  // Fetch live ride requests
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch("/api/getRides");
        if (!response.ok) {
          throw new Error(`Failed to fetch rides: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched rides:", data.rides);
        setLiveRides(data.rides); // Set the fetched rides to state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rides:", error);
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  const handleReject = async (rideId: string) => {
    setPopupVisible(true);
    try {
      const response = await fetch(`/api/deleteRide`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: rideId }),
      });
      console.log("Deleting ride with ID:", rideId);
  
      if (!response.ok) {
        throw new Error(`Failed to delete ride: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data.message);
  
      // Update the state to remove the deleted ride
      setLiveRides((prevRides) => prevRides.filter((ride) => ride._id !== rideId));
    } catch (error) {
      console.error("Error deleting ride:", error);
    }
  };
  const handleAccept = async (rideId: string) => {
    setPopup1Visible(true);
  };

  // useEffect(() => {
  //   const fetchPredictedFares = async () => {
  //     try {
  //       const response = await fetch("/api/getPredictedFares");
  //       if (!response.ok) {
  //         console.error(`Failed to fetch predicted fares: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       setLiveRides(data.rides); // Update the liveRides state with fetched data
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching predicted fares:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchPredictedFares();
  // }, []);

  return (
    <div className="flex">
      <SidebarDrive />
      <div className="ml-64 p-4 w-full bg-white text-black">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="bg-gradient-to-r from-gray-700 to-gray-400 text-white p-6 rounded-lg shadow-lg mb-10">
              <h1 className="text-4xl font-bold mb-2">Welcome, Driver</h1>
              <p className="text-lg">We are glad to have you back. Let's get started with your rides!</p>
            </div>
          </div>

          {/* Live Ride Requests */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center mb-10">
            <Card className="w-full md:w-6/7 lg:w-6/7 min-h-[550px]">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold mb-4">Live Ride Requests</h2>
                {loading ? (
                  <p>Loading ride requests...</p>
                ) : liveRides.length > 0 ? (
                    liveRides
                      .slice()
                      .reverse()
                      .map((ride, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-2"
                    >
                      {/* Ride Details */}
                      <div className="flex-grow">
                        <p className="text-sm font-medium">
                          📍 <span className="font-semibold">Pickup:</span> {ride.currentLocation}
                        </p>
                        <p className="text-sm font-medium">
                          📍 <span className="font-semibold">Dropoff:</span> {ride.destination}
                        </p>
                        <p className="text-sm text-gray-600">
                          Distance: {ride.distanceKm} km
                        </p>
                        <p className="text-sm text-gray-600">
                          Predicted Fare: ₹{ride.predictedPrice}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex-shrink-0 flex space-x-2">
                        <Button
                              variant="outline"
                              className="bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-300 active:bg-red-700 transition-all duration-200"
                              onClick={() => handleReject(ride._id)}
                        >
                          Reject
                        </Button>
                        <Button
                          className="bg-green-500 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-300 active:bg-green-700 transition-all duration-200"
                          onClick={() => handleAccept(ride._id)
                          }
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No live ride requests available.</p>
                )}
              </CardContent>
              {popupVisible && (
                      <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-10">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-bold">Successfully rejected</h2>
                          <button onClick={() => setPopupVisible(false)} className="text-white">
                            <FaTimes />
                          </button>
                        </div>
                        {/* <p>Please wait while we process your booking...</p> */}
                      </div>
              )}
              {popup1Visible && (
                      <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-10">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-bold">Successfully Accepted</h2>
                          <button onClick={() => setPopupVisible(false)} className="text-white">
                            <FaTimes />
                          </button>
                        </div>
                        {/* <p>Please wait while we process your booking...</p> */}
                      </div>
                    )}
            </Card>
          </div>
         
          {/* Overview */}
          <div
  id="overview"
  className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
>
  {/* Total Earnings */}
  <Card className="bg-gradient-to-r from-green-100 to-green-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardContent className="flex flex-col items-center text-center p-6">
      <h2 className="text-lg font-semibold mb-2 text-green-700">Total Earnings</h2>
      <FaRupeeSign className="w-10 h-10 text-green-500 mb-2" /> {/* Replace this icon if needed */}
      <p className="text-2xl font-bold text-green-800">₹1,250</p> {/* Updated to Rupee symbol */}
      <Progress value={1250} max={2000} />
    </CardContent>
  </Card>

  {/* Rides Completed */}
  <Card className="bg-gradient-to-r from-blue-100 to-blue-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardContent className="flex flex-col items-center text-center p-6">
      <h2 className="text-lg font-semibold mb-2 text-blue-700">Rides Completed</h2>
      <Car className="w-10 h-10 text-blue-500 mb-2" />
      <p className="text-2xl font-bold text-blue-800">320</p>
      <Progress value={320} max={500} />
    </CardContent>
  </Card>

  {/* Driver Rating */}
  <Card className="bg-gradient-to-r from-yellow-100 to-yellow-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardContent className="flex flex-col items-center text-center p-6">
      <h2 className="text-lg font-semibold mb-2 text-yellow-700">Driver Rating</h2>
      <div className="flex items-center mb-2">
        <Star className="w-6 h-6 text-yellow-500 fill-current" />
        <Star className="w-6 h-6 text-yellow-500 fill-current" />
        <Star className="w-6 h-6 text-yellow-500 fill-current" />
        <Star className="w-6 h-6 text-yellow-500 fill-current" />
        <Star className="w-6 h-6 text-gray-300 fill-current" />
      </div>
      <p className="text-2xl font-bold text-yellow-800">4.0</p>
    </CardContent>
  </Card>
</div>

          {/* Earnings Chart */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-3 mt-8 mb-11">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Earnings Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="earnings" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
           {/* User Reviews */}
           <Card className="col-span-1 md:col-span-2 lg:col-span-3 mt-">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">User Reviews</h2>
              <Slider {...sliderSettings}>
                {userReviews.map((review, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-lg font-bold">{review.name[0]}</span>
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold">{review.name}</p>
                        <div className="flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                          ))}
                          {[...Array(5 - review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-gray-300 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p>{review.review}</p>
                  </div>
                ))}
              </Slider>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
};

export default DriverDashboard;