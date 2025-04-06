import React, { useState, useEffect } from "react";
import axios from "axios";

interface Source {
  lat: string;
  lon: string;
}

interface DistanceResponse {
  distance: number;
}

const MapComponent: React.FC = () => {
  const [source, setSource] = useState<Source>({ lat: "", lon: "" });
  const [destination, setDestination] = useState<string>("");
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSource({
            lat: position.coords.latitude.toFixed(6),
            lon: position.coords.longitude.toFixed(6),
          });
        },
        (err) => {
          console.error("Error fetching location:", err);
          setError("Unable to fetch your current location. Please enter it manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleCalculateDistance = async (): Promise<void> => {
    try {
      setError("");
      const response = await axios.post<DistanceResponse>("http://localhost:8000/get_distance", {
        source_lat: parseFloat(source.lat),
        source_lon: parseFloat(source.lon),
        destination: destination,
      });
      setDistance(response.data.distance);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Error calculating distance");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-lg font-semibold mb-4">Calculate Distance</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDestination(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter destination address"
          />
        </div>
        <button
          onClick={handleCalculateDistance}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md shadow-md"
        >
          Calculate Distance
        </button>
        {distance && (
          <p className="mt-4 text-green-600">Distance: {distance.toFixed(2)} km</p>
        )}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default MapComponent; 