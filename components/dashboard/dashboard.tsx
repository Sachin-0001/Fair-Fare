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
import MapComponent from "@/components/MapComponent"
import PredictComponent from "../PredictComponent"
import dynamic from "next/dynamic";

// Dynamically import LeafletMap with SSR disabled
const LeafletMap = dynamic(() => import("@/components/leafletMap"), { ssr: false });

export default function Dashboard() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [destination, setDestination] = useState("")
  const [suggestions, setSuggestions] = useState<{ id: number; name: string }[]>([])
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
  
  const suggestionsRef = useRef(null)

  // Mock locations for auto-suggestions
  const mockLocations = [
    { id: 1, name: "Bangalore Airport, Karnataka" },
    { id: 2, name: "Bandra Station, Mumbai" },
    { id: 3, name: "Bannerghatta Road, Bangalore" },
    { id: 4, name: "Koramangala, Bangalore" },
    { id: 5, name: "MG Road, Bangalore" },
    { id: 6, name: "Indiranagar, Bangalore" },
    {id: 7, name: "Kempegowda Bus Station, Bangalore"},
    {id: 8, name: "Chattrapati Shivaji Airport, Mumbai"},
    {id: 9, name: "Churchgate Station, Hyderabad"}
  
  ]

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

  // Past rides data
  // const pastRides = [
  //   { id: 1, from: "Home", to: "Office", date: "Today", time: "9:30 AM", fare: 350, rating: 5 },
  //   { id: 2, from: "Office", to: "Home", date: "Yesterday", time: "6:30 PM", fare: 380, rating: 4 },
  //   { id: 3, from: "Home", to: "Airport", date: "Last Week", time: "5:00 AM", fare: 650, rating: 5 }
  // ]

  // Upcoming rides
  const upcomingRides = [
    { id: 1, from: "Home", to: "Concert Hall", date: "Tomorrow", time: "7:30 PM", fare: 450 }
  ]

  // Function to reverse geocode latitude and longitude to an address
  const reverseGeocode = async (lat: number, lon: number) => {
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
          setCurrentLocation({ lat: latitude, lon: longitude, address: "Fetching address..." });
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

  // Fetch the user's location on component mount
  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (destination.trim() === "") {
      setSuggestions([])
      return
    }
    
    const filteredSuggestions = mockLocations.filter(location => 
      location.name.toLowerCase().includes(destination.toLowerCase())
    )
    setSuggestions(filteredSuggestions)
  }, [destination])

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

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !(suggestionsRef.current as HTMLElement).contains(event.target as Node)) {
      setShowSuggestions(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  useEffect(() => {
      const fetchRides = async () => {
        try {
          const response = await fetch("/api/getRides");
          if (!response.ok) {
            throw new Error(`Failed to fetch rides: ${response.status}`);
          }
          const data = await response.json();
          setPastRides(data.rides.slice(-3)); // Limit to the last 3 rides
          setLoading(false);
        } catch (error) {
          console.error("Error fetching rides:", error);
          setLoading(false);
        }
      };
  
      fetchRides();
    }, []);

  const handleLockFare = () => {
    setFareLocked(true)
    setLockCountdown(300) // Reset to 5 minutes
  }

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
    distanceKm: number; // Added distanceKm property
    rating?: number;
    fare: number;
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

  const handleSelectSuggestion = (suggestion: Suggestion): void => {
    setDestination(suggestion.name)
    setShowSuggestions(false)
  }

  const getSurgeColor = () => {
    if (surgeLevel < 1.3) return "bg-green-100 text-green-800"
    if (surgeLevel < 1.8) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BasicSidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-6 shadow-sm">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 rounded-md hover:bg-gray-100 mr-4"
          >
            <Menu className="h-5 w-5" />
          </button>
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </header>
        
        <main className="flex-1 p-6 text-black">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1️⃣ Ride Booking Section */}
              <Card className="overflow-visible">
                <CardHeader>
                  <CardTitle>Book Your Ride</CardTitle>
                  <CardDescription>Enter your destination to get started</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Pickup Location */}
                    <div className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Current Location</p>
                        <p className="text-xs text-gray-500">{currentLocation.address}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={fetchCurrentLocation}>
                        <MapPin className="h-4 w-4 mr-1" /> Refresh
                      </Button>
                    </div>
                    
                    {/* Destination with Auto-suggest */}
                    <div className="relative" ref={suggestionsRef}>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <MapPin className="h-5 w-5 text-red-500" />
                        <input
                          name="dest"
                          type="text"
                          placeholder="Where to?"
                          className="flex-1 bg-transparent outline-none"
                          value={destination}
                          onChange={(e) => {
                            setDestination(e.target.value)
                            setShowSuggestions(true)
                          }}
                          onFocus={() => setShowSuggestions(true)}
                        />
                      </div>
                      
                      {/* Auto-suggestions dropdown */}
                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {suggestions.map(suggestion => (
                            <div
                              key={suggestion.id}
                              className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
                              onClick={() => handleSelectSuggestion(suggestion)}
                            >
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              {suggestion.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Mini map preview */}
                    <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      {currentLocation.lat && currentLocation.lon ? (
                        <LeafletMap lat={currentLocation.lat} lon={currentLocation.lon} />
                      ) : (
                        <p className="text-gray-500">Fetching map preview...</p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Find Drivers</Button>
                </CardFooter>
              </Card>
              
              {/* 2️⃣ Live Surge Meter (Dynamic Pricing Info) */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Live Surge Meter</CardTitle>
                    <Badge className={getSurgeColor()}>
                      {surgeLevel}x Surge
                    </Badge>
                  </div>
                  <CardDescription>Real-time demand vs. available drivers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={demandData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="demand" name="Demand" fill="#f87171" />
                        <Bar dataKey="drivers" name="Drivers" fill="#60a5fa" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                      <p className="text-sm font-medium">Surge expected to drop by ₹30 in 5 minutes!</p>
                    </div>
                    <div className="mt-2 flex space-x-3 ">
                      <Button size="sm" variant="outline" className="flex-1 bg-white">Book Now</Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-white">Wait</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* 4️⃣ Estimated Fare & Ride Time Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Estimated Fare</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{currentFare.total}</div>
                    <div className="text-sm text-gray-500">
                      Base fare: ₹{currentFare.base} + Surge: ₹{currentFare.surge}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Ride Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{estimatedTime}</div>
                    <div className="text-sm text-gray-500">Shortest route</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Arrival Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{estimatedArrival}</div>
                    <div className="text-sm text-gray-500">Estimated</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* 3️⃣ Ride Locking Feature */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Fare Lock Protection</CardTitle>
                    <Shield className="h-5 w-5 text-blue-500" />
                  </div>
                  <CardDescription>Lock current fare for 5 minutes to avoid surge pricing</CardDescription>
                </CardHeader>
                <CardContent>
                  {fareLocked ? (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Fare locked</span>
                        <span className="text-green-600 font-medium">{formatTime(lockCountdown)} remaining</span>
                      </div>
                      <Progress value={(lockCountdown / 300) * 100} max={100} />
                      <p className="mt-2 text-sm text-gray-500">Your fare is protected from surge pricing until the timer expires.</p>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-3 text-sm text-gray-600">Current fare: ₹{currentFare.total} (includes surge pricing)</p>
                      <Button 
                        onClick={handleLockFare} 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        variant="outline"
                      >
                        Lock Fare
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar content - 1/3 width */}
            <div className="space-y-6">
              {/* 5️⃣ Trust Score Display */}
              <PredictComponent
              destination={destination}
              setDestination={setDestination}
              />
              
              
              <MapComponent />
              
              
              {/* 7️⃣ Upcoming Rides */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Upcoming Rides</CardTitle>
                  <CardDescription>Your scheduled rides</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingRides.map(ride => (
                      <div key={ride.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                        <div>
                          <p className="text-sm font-medium">{ride.from} to {ride.to}</p>
                          <p className="text-xs text-gray-500">{ride.date} at {ride.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">₹{ride.fare}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
             
             
              {/* 6️⃣ Past Rides */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Past Rides</CardTitle>
                  <CardDescription>Your ride history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pastRides.length > 0 ? (
                      pastRides
                        .slice()
                        .reverse()
                        .map((ride) => (
                        <div
                          key={ride.id}
                          className="flex justify-between items-center p-3 border rounded-lg bg-gray-50"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {ride.currentLocation} to {ride.destination}
                            </p>
                            <p className="text-xs text-gray-500">
                              Distance: {ride.distanceKm} km
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">₹{ride.fare}</p>
                            <div className="flex items-center space-x-1">
                              {[...Array(ride.rating || 0)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-500" />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No past rides available.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Trust Score</CardTitle>
                  <CardDescription>Your reliability score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div className="text-2xl font-bold">{trustScore}</div>
                    <div className="text-sm text-gray-500">/ 100</div>
                  </div>
                  <Progress value={trustScore} max={100} />
                </CardContent>
              </Card>
            </div>
          </div> 
        </main>
      </div>
    </div>
  )
}