"use client"

import { useState, useEffect, useRef } from "react"
import { UserNav } from "@/components/dashboard/user-nav"
import { MainNav } from "@/components/dashboard/main-nav"
import { BasicSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Search } from "@/components/dashboard/search"
import { Button } from "@/components/ui/button"
import { 
  Filter, Menu, Activity, BarChart, FileText, Clock, DollarSign, Shield, 
  MapPin, ChevronDown, Star, AlertCircle
} from "lucide-react"
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card"
import Progress from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import dynamic from "next/dynamic";
import PredictComponent from "../PredictComponent"
import { useRouter } from 'next/router';

// Dynamically import map components with loading states
const LeafletMap = dynamic(() => import("@/components/leafletMap"), { 
  ssr: false,
  loading: () => <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
});

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  loading: () => <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
});

// Skeleton components for loading states
const CardSkeleton = () => (
  <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 animate-pulse">
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="h-8 w-1 bg-gradient-to-b from-gray-700 to-gray-600 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-[140px]"></div>
          <div className="h-3 bg-gray-700 rounded w-[100px]"></div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

const MapSkeleton = () => (
  <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-2 relative min-h-[400px]">
    <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-gray-500 flex items-center space-x-2">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading map...</span>
      </div>
    </div>
  </div>
);

const SearchSkeleton = () => (
  <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6">
    <div className="flex gap-3">
      <div className="relative flex-1">
        <div className="h-12 bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
      <div className="h-12 w-24 bg-gray-700 rounded-lg animate-pulse"></div>
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-1.5 bg-gradient-to-b from-blue-500/50 to-purple-500/50 rounded-full animate-pulse"></div>
        <div>
          <div className="h-8 w-64 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-700 rounded mt-2 animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <SearchSkeleton />
          <MapSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  </div>
);

// Add mock data for fallback
const mockPastRides = [
  { id: 1, currentLocation: "Home", destination: "Office", distanceKm: 5.2, rating: 5, fare: 350, finalFare: 350 },
  { id: 2, currentLocation: "Office", destination: "Home", distanceKm: 5.2, rating: 4, fare: 380, finalFare: 380 },
  { id: 3, currentLocation: "Home", destination: "Airport", distanceKm: 25.5, rating: 5, fare: 650, finalFare: 650 }
];

const mockUserLocation = {
  address: "Bangalore, Karnataka",
  lat: 12.9716,
  lon: 77.5946
};

// Add this interface near other interfaces
interface GeocodingResult {
  lat: number;
  lon: number;
  display_name: string;
}

// Update the LeafletMap component props interface
interface LeafletMapProps {
  lat: number;
  lon: number;
  destination?: { lat: number; lon: number } | null;
}

// Add new interface for Nominatim suggestion
interface NominatimSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

// Add the calculateDistance function at the top level
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Number(distance.toFixed(2));
};

export default function Dashboard() {
  const router = useRouter();
  let userRole: string | null = null;

  // Check if running in the browser
  if (typeof window !== 'undefined') {
    userRole = localStorage.getItem('role');
  }

  useEffect(() => {
    if (userRole !== 'USER') {
      router.push('/unauthorized'); // Redirect to an unauthorized page
    }
  }, [userRole, router]);

  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [destination, setDestination] = useState("")
  const [suggestions, setSuggestions] = useState<{ id: number; name: string; lat: number; lon: number }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [fareLocked, setFareLocked] = useState(false)
  const [lockCountdown, setLockCountdown] = useState(300) // 5 minutes in seconds
  const [currentFare, setCurrentFare] = useState({ base: 225, surge: 50, total: 275 })
  const [estimatedTime, setEstimatedTime] = useState("20 min")
  const [estimatedArrival, setEstimatedArrival] = useState("8:15 PM")
  const [surgeLevel, setSurgeLevel] = useState(1.8)
  const [trustScore, setTrustScore] = useState(85)
  const [currentLocation, setCurrentLocation] = useState<{
    address: string;
    lat: number | null;
    lon: number | null;
  }>({
    address: "Fetching your location...",
    lat: null,
    lon: null,
  })
  const [pastRides, setPastRides] = useState<Ride[]>([]); 
  const [loading, setLoading] = useState(true);
  const [locationCache, setLocationCache] = useState<{lat: number; lon: number; address: string} | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{lat: number; lon: number} | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [rideDistance, setRideDistance] = useState<number>(0);
  
  const suggestionsRef = useRef(null)

  // Add debounce timer ref
  const suggestionDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Mock data for surge meter chart
  const demandData = [
    { time: '9 AM', demand: 30, drivers: 45 },
    { time: '10 AM', demand: 40, drivers: 42 },
    { time: '11 AM', demand: 45, drivers: 40 },
    { time: '15 PM', demand: 50, drivers: 35 },
    { time: 'Now', demand: 75, drivers: 42 },
    { time: '1 PM', demand: 60, drivers: 45, predicted: true },
    { time: '2 PM', demand: 50, drivers: 48, predicted: true },
  ]

  // Upcoming rides
  const upcomingRides = [
    { id: 1, from: "Home", to: "Concert Hall", date: "Tomorrow", time: "7:30 PM", fare: 450 }
  ]

  // Add geocoding function
  const geocodeLocation = async (locationName: string): Promise<GeocodingResult | null> => {
    try {
      setIsGeocoding(true);
      setGeocodingError(null);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          display_name: data[0].display_name
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      setGeocodingError('Failed to find location. Please try again.');
      return null;
    } finally {
      setIsGeocoding(false);
    }
  };

  // Update handleSelectSuggestion to calculate distance
  const handleSelectSuggestion = async (suggestion: { id: number; name: string; lat: number; lon: number }): Promise<void> => {
    setDestination(suggestion.name);
    setSuggestions([]); // Clear suggestions
    setShowSuggestions(false); // Hide suggestions popup
    
    // Set destination coordinates
    setDestinationCoords({
      lat: suggestion.lat,
      lon: suggestion.lon
    });

    // Calculate distance if we have both current location and destination
    if (currentLocation.lat && currentLocation.lon) {
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lon,
        suggestion.lat,
        suggestion.lon
      );

      // Update current fare based on distance
      const basePrice = 30;
      const additionalChargePerKM = 15;
      const additionalDistance = distance > 2 ? distance - 2 : 0;
      const totalPrice = basePrice + additionalDistance * additionalChargePerKM;
      
      setCurrentFare({
        base: basePrice,
        surge: Math.floor(totalPrice * (surgeLevel - 1)),
        total: Math.floor(totalPrice * surgeLevel)
      });
    }

    // Clear any existing debounce timer
    if (suggestionDebounceRef.current) {
      clearTimeout(suggestionDebounceRef.current);
    }
  };

  // Update handleDestinationChange to manage suggestions visibility
  const handleDestinationChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const value = e.target.value;
    setDestination(value);
    
    // Clear any existing debounce timer
    if (suggestionDebounceRef.current) {
      clearTimeout(suggestionDebounceRef.current);
    }

    if (!value.trim() || value.length < 2) {
      setSuggestions([]); // Clear suggestions
      setShowSuggestions(false);
      setDestinationCoords(null);
      return;
    }

    // Debounce API call for suggestions
    suggestionDebounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&addressdetails=1`
        );
        
        if (!response.ok) throw new Error('Failed to fetch suggestions');
        
        const data: NominatimSuggestion[] = await response.json();
        const formattedSuggestions = data.map(item => ({
          id: item.place_id,
          name: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        }));
        
        setSuggestions(formattedSuggestions);
        setShowSuggestions(formattedSuggestions.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]); // Clear suggestions on error
        setShowSuggestions(false);
      }
    }, 300);
  };

  // Update the fetchCurrentLocation function
  const fetchCurrentLocation = async (): Promise<void> => {
    try {
      setLoading(true);
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const locationData = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        address: "Fetching address..."
      };
      
      setCurrentLocation(locationData);
      
      // Update address using reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${locationData.lat}&lon=${locationData.lon}`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setCurrentLocation(prev => ({
          ...prev,
          address: data.display_name
        }));
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setCurrentLocation(prev => ({
        ...prev,
        address: "Error fetching location"
      }));
    } finally {
      setLoading(false);
    }
  };

  // Update the fetchDashboardData function
  const fetchDashboardData = async () => {
    try {
      setIsDashboardLoading(true);

      // Try to fetch data from APIs, but don't fail if they're not available
      const [ridesResponse] = await Promise.allSettled([
        fetch("/api/getRides")
      ]);

      // Handle rides data
      if (ridesResponse.status === 'fulfilled' && ridesResponse.value.ok) {
        const ridesData = await ridesResponse.value.json();
        // Map the API response to match the Ride interface
        const formattedRides = ridesData.rides?.map((ride: any) => ({
          id: ride._id,
          currentLocation: ride.currentLocation,
          destination: ride.destination,
          distanceKm: ride.distanceKm,
          rating: 5, // Default rating
          fare: ride.predictedPrice,
          finalFare: ride.finalFare
        })) || mockPastRides.slice(-3);
        setPastRides(formattedRides.slice(-3));
      } else {
        console.warn('Failed to fetch rides, using mock data');
        setPastRides(mockPastRides.slice(-3));
      }

      // Use navigator.geolocation to set current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const locationData = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        address: "Fetching address..."
      };

      setCurrentLocation(locationData);

      // Update address using reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${locationData.lat}&lon=${locationData.lon}`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setCurrentLocation(prev => ({
          ...prev,
          address: data.display_name
        }));
      }

    } catch (error) {
      console.error("Error in fetchDashboardData:", error);
      // Use mock data as fallback
      setPastRides(mockPastRides.slice(-3));
      setCurrentLocation(mockUserLocation);
    } finally {
      setIsDashboardLoading(false);
      setLoading(false);
    }
  };

  // Initialize dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch location only if needed
  useEffect(() => {
    if (!currentLocation.lat || !currentLocation.lon) {
      fetchCurrentLocation();
    }
  }, []);

  // Handle countdown timer for fare lock
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    if (fareLocked && lockCountdown > 0) {
      timer = setInterval(() => {
        setLockCountdown(prev => prev - 1)
      }, 1000)
    } else if (lockCountdown === 0) {
      setFareLocked(false)
    }
    
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [fareLocked, lockCountdown])

  // Update the cleanup function in the click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !(suggestionsRef.current as HTMLElement).contains(event.target as Node)) {
        setShowSuggestions(false);
        if (suggestionDebounceRef.current) {
          clearTimeout(suggestionDebounceRef.current);
        }
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (suggestionDebounceRef.current) {
        clearTimeout(suggestionDebounceRef.current);
      }
    };
  }, []);

  const handleLockFare = () => {
    setFareLocked(true)
    setLockCountdown(300) // Reset to 5 minutes
  }

  // Update handleCalculateDistance to set the ride distance
  const handleCalculateDistance = () => {
    if (!currentLocation.lat || !currentLocation.lon || !destinationCoords) {
      return;
    }

    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lon,
      destinationCoords.lat,
      destinationCoords.lon
    );

    // Set the ride distance
    setRideDistance(distance);

    // Update current fare based on distance
    const basePrice = 30;
    const additionalChargePerKM = 15;
    const additionalDistance = distance > 2 ? distance - 2 : 0;
    const totalPrice = basePrice + additionalDistance * additionalChargePerKM;
    
    setCurrentFare({
      base: basePrice,
      surge: Math.floor(totalPrice * (surgeLevel - 1)),
      total: Math.floor(totalPrice * surgeLevel)
    });
  };

  interface Suggestion {
    id: number;
    name: string;
  }

  interface Fare {
    base: number;
    surge: number;
    total: number;
  }

  interface Ride {
    id: number;
    currentLocation: string;
    destination: string;
    distanceKm: number;
    rating?: number;
    fare: number;
    finalFare: number;
  }

  interface DemandData {
    time: string;
    demand: number;
    drivers: number;
    predicted?: boolean;
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getSurgeColor = () => {
    if (surgeLevel < 1.3) return "bg-green-100 text-green-800"
    if (surgeLevel < 1.8) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  // Show loading skeleton while dashboard is loading
  if (isDashboardLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="h-12 w-1.5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Fair Fare Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Find the best rides at the fairest prices
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search and Map Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Box */}
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={destination}
                    onChange={handleDestinationChange}
                    placeholder="Enter your destination"
                    className="w-full px-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all
                             bg-gray-700 text-white placeholder:text-gray-400 pr-10"
                  />
                  {destination && (
                    <button
                      onClick={() => {
                        setDestination("");
                        setSuggestions([]);
                        setShowSuggestions(false);
                        setDestinationCoords(null);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  {suggestions.length > 0 && (
                    <div className="absolute z-[60] w-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-[300px] overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectSuggestion(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-none
                                   text-gray-200"
                        >
                          {suggestion.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleCalculateDistance}
                  disabled={!destinationCoords || !currentLocation.lat || !currentLocation.lon}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium 
                           hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Calculate
                </button>
              </div>
            </div>

            {/* Map Container */}
            <div className="bg-gray-800 rounded-xl shadow-xl p-2 border border-gray-700 z-10 relative min-h-[400px] overflow-hidden">
              {currentLocation.lat && currentLocation.lon ? (
                <LeafletMap 
                  lat={currentLocation.lat} 
                  lon={currentLocation.lon}
                  destination={destinationCoords}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-800">
                  <div className="text-gray-400">Loading map...</div>
                </div>
              )}
            </div>

            {/* Surge Meter Card */}
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Live Surge Meter
                    </h2>
                    <p className="text-gray-400">Real-time demand vs. available drivers</p>
                  </div>
                </div>
                <Badge className={`${getSurgeColor()} px-3 py-1 text-sm font-medium rounded-full`}>
                  {surgeLevel}x Surge
                </Badge>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={demandData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                    <XAxis dataKey="time" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                        color: '#e5e7eb'
                      }}
                    />
                    <Bar dataKey="demand" name="Demand" fill="#f87171" />
                    <Bar dataKey="drivers" name="Drivers" fill="#60a5fa" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 p-4 bg-gradient-to-r from-amber-900/30 to-yellow-900/30 rounded-lg border border-amber-800/50">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                  <p className="text-sm font-medium text-amber-200">Surge expected to drop by ₹30 in 5 minutes!</p>
                </div>
                <div className="mt-3 flex space-x-3">
                  <button className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors font-medium">
                    Book Now
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors font-medium">
                    Wait
                  </button>
                </div>
              </div>
            </div>

            {/* Fare Lock Card */}
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Fare Lock Protection
                    </h2>
                    <Shield className="h-5 w-5 text-blue-400" />
                  </div>
                  <p className="text-gray-400">Lock current fare for 5 minutes to avoid surge pricing</p>
                </div>
              </div>

              {fareLocked ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-300">Fare locked</span>
                    <span className="text-green-400 font-medium">{formatTime(lockCountdown)} remaining</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                      style={{ width: `${(lockCountdown / 300) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400">Your fare is protected from surge pricing until the timer expires.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-400">Current fare: ₹{currentFare.total} (includes surge pricing)</p>
                  <button 
                    onClick={handleLockFare}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium 
                             hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg"
                  >
                    Lock Fare
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Prediction Component */}
            <PredictComponent
              destination={destination}
              setDestination={setDestination}
              destinationCoords={destinationCoords}
              rideDistance={rideDistance}
            />

            {/* Trust Score Card */}
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Trust Score
                  </h2>
                  <p className="text-gray-400">Your reliability rating</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <Star className="h-6 w-6 text-yellow-400" />
                <div className="text-3xl font-bold text-gray-200">{trustScore}</div>
                <div className="text-lg text-gray-400">/ 100</div>
              </div>

              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-1000"
                  style={{ width: `${trustScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Past Rides Section */}
        <div className="mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Past Rides
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastRides && pastRides.length > 0 ? (
              pastRides
                .slice()
                .reverse()
                .map((ride, index) => (
                  <div
                    key={ride.id || index}
                    className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-700"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-300">From</p>
                          <p className="text-sm text-gray-400 break-words">{ride.currentLocation}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-300">To</p>
                          <p className="text-sm text-gray-400 break-words">{ride.destination}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                        <div>
                          <p className="text-sm text-gray-400">Distance</p>
                          <p className="text-lg font-semibold text-gray-200">{ride.distanceKm} km</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Final Fare</p>
                          <p className="text-lg font-semibold text-gray-200">₹{ride.finalFare}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-400">No past rides found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}