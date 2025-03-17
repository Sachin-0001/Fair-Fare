from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:3000"],  # Replace "*" with your frontend URL for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenRouteService API Key
ORS_API_KEY = "5b3ce3597851110001cf6248b398e77b769346ccb99fe14362ece047"

# Model for input data
class LocationRequest(BaseModel):
    source_lat: float
    source_lon: float
    destination: str

# Convert address to latitude & longitude using Nominatim API
def get_coordinates(address: str):
    url = f"https://nominatim.openstreetmap.org/search?format=json&q={address}"
    response = requests.get(url)
    if response.status_code == 200 and response.json():
        location = response.json()[0]
        return float(location["lat"]), float(location["lon"])
    return None, None

# Calculate distance using OpenRouteService
def get_distance(source_lat, source_lon, dest_lat, dest_lon):
    url = f"https://api.openrouteservice.org/v2/directions/driving-car"
    headers = {"Authorization": ORS_API_KEY}
    params = {
        "start": f"{source_lon},{source_lat}",
        "end": f"{dest_lon},{dest_lat}"
    }
    
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        distance_km = data["routes"][0]["summary"]["distance"] / 1000
        return distance_km
    return None

@app.post("/get_distance")
async def calculate_distance(request: LocationRequest):
    dest_lat, dest_lon = get_coordinates(request.destination)
    if dest_lat is None or dest_lon is None:
        raise HTTPException(status_code=400, detail="Invalid destination address")
    
    distance = get_distance(request.source_lat, request.source_lon, dest_lat, dest_lon)
    if distance is None:
        raise HTTPException(status_code=500, detail="Error fetching distance")

    return {"distance": distance}