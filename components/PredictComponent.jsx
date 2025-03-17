import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PredictComponent = () => {
  const [inputData, setInputData] = useState({
    City: 2,
    Day_of_Week: new Date().getDay(),
    Latitude: 40.7128,
    Longitude: -74.0060,
    Ride_Distance_KM: 0, // Default ride distance
    Ride_Type: 1,
    Weather: 0,
    Event: 0,
    Payment_Type: 1,
    Available_Drivers: 10,
    User_Booking_Count: 1,
    Traffic_Density: 0.5,
    Previous_Surge: 1.0,
    Fare_Acceptance: 0.8,
    Demand_Level: 1.0,
    Surge_Multiplier: 1.0,
    Final_Fare: 10.0,
    Hour_of_Day: new Date().getHours(),
    Is_Weekend: [0, 6].includes(new Date().getDay()) ? 1 : 0,
    Real_Time_Demand: 1.0,
    Driver_Performance_Score: 4.0,
    Smart_Timeout: 30.0,
    AI_Demand_Prediction: 1.0,
    Driver_XP: 2.0,
    Ride_Priority: 0,
    Fare_Protection: 0,
    Year: new Date().getFullYear(),
    Month: new Date().getMonth() + 1,
    Day: new Date().getDate(),
  });
  const [currentLocation, setCurrentLocation] = useState({
    address: "Fetching your location...",
    lat: null,
    lon: null,
  });
  const [destination, setDestination] = useState(""); // Destination name
  const [prediction, setPrediction] = useState(null);
  const [finalPrice, setFinalPrice] = useState(null); // State to store the final price in rupees
  const [popupVisible, setPopupVisible] = useState(false); // State for popup visibility
  // Function to reverse geocode latitude and longitude to an address
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setCurrentLocation((prev) => ({
          ...prev,
          address: data.display_name,
        }));
      } else {
        setCurrentLocation((prev) => ({
          ...prev,
          address: "Unable to fetch address",
        }));
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      setCurrentLocation((prev) => ({
        ...prev,
        address: "Error fetching address",
      }));
    }
  };

  // Function to fetch the user's current location
  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({
            lat: latitude,
            lon: longitude,
            address: "Fetching address...",
          });
          reverseGeocode(latitude, longitude); // Reverse geocode to get the address
        },
        (error) => {
          console.error("Error fetching location:", error);
          setCurrentLocation((prev) => ({
            ...prev,
            address: "Unable to fetch location",
          }));
        }
      );
    } else {
      setCurrentLocation((prev) => ({
        ...prev,
        address: "Geolocation not supported by your browser",
      }));
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setPopupVisible(true);// Prevent form submission reload
    try {
      // Step 1: Predict the price
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.prediction);

      // Calculate the final price
      const basePrice = 30; // Minimum fare for the first 2 kilometers
      const additionalChargePerKM = 15; // Charge per kilometer beyond 2 kilometers
      const rideDistance = parseFloat(inputData.Ride_Distance_KM); // Get the ride distance from input
      const additionalDistance = rideDistance > 2 ? rideDistance - 2 : 0; // Distance beyond 2 kilometers
      const totalPrice = basePrice + additionalDistance * additionalChargePerKM; // Total price before discount
      const priceDropPercentage = data.prediction; // Prediction is the price drop percentage
      const calculatedPrice = totalPrice - (totalPrice * priceDropPercentage) / 100; // Apply price drop
      setFinalPrice(calculatedPrice.toFixed(2)); // Round to 2 decimal places

      // Step 2: Save the ride data to the database
      const saveRideResponse = await fetch("/api/saveRide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentLocation: currentLocation.address,
          currentLat: currentLocation.lat,
          currentLon: currentLocation.lon,
          destination,
          distanceKm: inputData.Ride_Distance_KM,
          predictedPrice: calculatedPrice,
        }),
      });

      if (!saveRideResponse.ok) {
        throw new Error(`Failed to save ride! status: ${saveRideResponse.status}`);
      }

      console.log("Ride saved successfully!");
    } catch (error) {
      console.error("Error during prediction or saving ride:", error);
    }
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <CardTitle>Predict Fare</CardTitle>
        <CardDescription>Enter ride details to predict the fare</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="predict-form" onSubmit={handlePredict}>
          <div className="flex flex-col space-y-4">
            <div className="form-group">
              <label>Current Location:</label>
              <p className="text-sm text-gray-500">{currentLocation.address}</p>
              <Button variant="outline" className='bg-white'onClick={fetchCurrentLocation}>
                Refresh Location
              </Button>
            </div>
            <div className="form-group">
              <label>Destination:</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination name (e.g., Brooklyn)"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="form-group">
              <label>Ride Distance (KM):</label>
              <input
                type="number"
                name="Ride_Distance_KM"
                value={inputData.Ride_Distance_KM}
                onChange={handleInputChange}
                placeholder="Enter ride distance in kilometers"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="predict-button w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Predict
            </button>
          </div>
          {prediction !== null && (
            <div className="predict-result mt-4">
              <p className="text-lg font-bold">Prediction Results:</p>
              <p>Price Drop Percentage: {prediction}%</p>
              <p>Final Price: ₹{finalPrice}</p>
            </div>
          )}
        </form>
      </CardContent>
      {popupVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Booking Under Progress</h2>
            <p>Please wait while we process your booking...</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PredictComponent;