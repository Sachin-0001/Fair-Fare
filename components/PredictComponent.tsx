import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaTimes } from "react-icons/fa";

interface Location {
  address: string;
  lat: number;
  lon: number;
}

interface InputData {
  City: number;
  Day_of_Week: number;
  Latitude: number;
  Longitude: number;
  Ride_Distance_KM: number;
  Ride_Type: number;
  Weather: number;
  Event: number;
  Payment_Type: number;
  Available_Drivers: number;
  User_Booking_Count: number;
  Traffic_Density: number;
  Previous_Surge: number;
  Fare_Acceptance: number;
  Demand_Level: number;
  Surge_Multiplier: number;
  Final_Fare: number;
  Hour_of_Day: number;
  Is_Weekend: number;
  Real_Time_Demand: number;
  Driver_Performance_Score: number;
  Smart_Timeout: number;
  AI_Demand_Prediction: number;
  Driver_XP: number;
  Ride_Priority: number;
  Fare_Protection: number;
  Year: number;
  Month: number;
  Day: number;
}

interface PredictComponentProps {
  destination: string;
  setDestination: (value: string) => void;
  destinationCoords: { lat: number; lon: number } | null;
  rideDistance: number;
}

const PredictComponent: React.FC<PredictComponentProps> = ({ 
  destination, 
  setDestination,
  destinationCoords,
  rideDistance 
}) => {
  const [inputData, setInputData] = useState<InputData>({
    City: 2,
    Day_of_Week: new Date().getDay(),
    Latitude: 0,
    Longitude: 0,
    Ride_Distance_KM: rideDistance,
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

  const [currentLocation, setCurrentLocation] = useState<Partial<Location>>({
    address: "Fetching your location...",
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [finalPrice, setFinalPrice] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);

  const reverseGeocode = async (lat: number, lon: number): Promise<void> => {
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

  const fetchCurrentLocation = (): void => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({
            lat: latitude,
            lon: longitude,
            address: "Fetching address...",
          });
          reverseGeocode(latitude, longitude);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: parseFloat(value),
    }));
  };

  const handlePredict = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setPopupVisible(true);
    try {
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

      const basePrice = 30;
      const additionalChargePerKM = 15;
      const rideDistance = parseFloat(inputData.Ride_Distance_KM.toString());
      const additionalDistance = rideDistance > 2 ? rideDistance - 2 : 0;
      const totalPrice = basePrice + additionalDistance * additionalChargePerKM;
      const priceDropPercentage = data.prediction;
      const calculatedPrice = totalPrice - (totalPrice * priceDropPercentage) / 100;
      setFinalPrice(calculatedPrice.toFixed(2));
    } catch (error) {
      console.error("Error during prediction:", error);
      setPopupVisible(false);
    }
  };

  const handleBookNow = async (): Promise<void> => {
    if (!currentLocation.lat || 
        !currentLocation.lon || 
        !destinationCoords?.lat || 
        !destinationCoords?.lon ||
        !destination ||
        !finalPrice) {
      console.warn("Missing required data for booking");
      return;
    }

    try {
      const basePrice = 30;
      const additionalChargePerKM = 15;
      const additionalDistance = rideDistance > 2 ? rideDistance - 2 : 0;
      const totalPrice = basePrice + additionalDistance * additionalChargePerKM;

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
          destinationLat: destinationCoords.lat,
          destinationLon: destinationCoords.lon,
          distanceKm: inputData.Ride_Distance_KM,
          predictedPrice: parseFloat(finalPrice),
          finalFare: Math.round(totalPrice)
        }),
      });

      if (!saveRideResponse.ok) {
        console.error("Failed to save ride:", await saveRideResponse.text());
      } else {
        console.log("Ride booked successfully!");
        // Show success message or redirect
        setPopupVisible(true);
        setTimeout(() => setPopupVisible(false), 3000);
      }
    } catch (saveError) {
      console.error("Error booking ride:", saveError);
    }
  };

  // Add function to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };

  // Update distance when coordinates change
  useEffect(() => {
    const lat = currentLocation.lat;
    const lon = currentLocation.lon;
    
    if (typeof lat === 'number' && 
        typeof lon === 'number' && 
        destinationCoords?.lat !== undefined && 
        destinationCoords?.lon !== undefined) {
      const distance = calculateDistance(
        lat,
        lon,
        destinationCoords.lat,
        destinationCoords.lon
      );
      
      setInputData(prev => ({
        ...prev,
        Ride_Distance_KM: distance,
        Latitude: lat,
        Longitude: lon
      }));
    }
  }, [currentLocation.lat, currentLocation.lon, destinationCoords]);

  // Add effect to reset prediction and final price when destination changes
  useEffect(() => {
    setPrediction(null);
    setFinalPrice(null);
    setPopupVisible(false);
    setInputData(prev => ({
        ...prev,
        Ride_Distance_KM: 0
    }));
  }, [destination]);

  // Update inputData when rideDistance changes
  useEffect(() => {
    setInputData(prev => ({
      ...prev,
      Ride_Distance_KM: rideDistance
    }));
  }, [rideDistance]);

  return (
    <Card className="relative bg-gray-800 rounded-xl shadow-xl border border-gray-700">
      <CardHeader className="pb-2 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Predict Fare
            </CardTitle>
            <CardDescription className="text-gray-400">
              Get instant fare predictions for your ride
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form className="predict-form space-y-6" onSubmit={handlePredict}>
          <div className="space-y-6">
            <div className="form-group bg-gray-700/50 p-4 rounded-lg border border-gray-600 hover:bg-gray-700/70 transition-all">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Current Location</label>
              <p className="text-sm text-gray-400 mb-3 break-words">{currentLocation.address}</p>
              <Button 
                variant="outline" 
                className="bg-gray-800 hover:bg-gray-700 border-gray-600 text-gray-300 flex items-center space-x-2"
                onClick={fetchCurrentLocation}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Refresh Location</span>
              </Button>
            </div>

            <div className="form-group bg-gray-700/50 p-4 rounded-lg border border-gray-600 hover:bg-gray-700/70 transition-all">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Destination</label>
              <p className="text-sm text-gray-400 mb-2">{destination || "Not selected"}</p>
            </div>

            <div className="form-group bg-gray-700/50 p-4 rounded-lg border border-gray-600 hover:bg-gray-700/70 transition-all">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Ride Distance</label>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold text-gray-200">{inputData.Ride_Distance_KM}</p>
                <span className="text-sm text-gray-400">kilometers</span>
              </div>
            </div>

            {finalPrice && prediction !== null && (
              <p className="text-lg text-gray-200">
                Price drop: <span className="text-green-400">{prediction?.toFixed(2)}%</span> • Final price: <span className="font-bold">₹{finalPrice}</span>
              </p>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                disabled={!destination || !currentLocation.lat || !currentLocation.lon}
              >
                Calculate Fare
              </Button>
              <Button
                type="button"
                onClick={handleBookNow}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                disabled={!finalPrice || !destination || !currentLocation.lat || !currentLocation.lon}
              >
                Book Now
              </Button>
            </div>
          </div>
        </form>
      </CardContent>

      {popupVisible && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Success!</h2>
            <button onClick={() => setPopupVisible(false)} className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

// Add this CSS at the top of your file or in your global CSS
const styles = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.3s ease-out;
  }
`;

export default PredictComponent; 