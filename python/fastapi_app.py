from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import requests
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google Drive Configuration
file_id = '1cnKv9ZKg5-2FjhBstRDmqRve2Jy-Ah8p'
dwn_url = f"https://drive.google.com/uc?id={file_id}"

# Download the model from Google Drive
response = requests.get(dwn_url)
with open('model.pkl', 'wb') as f:
    f.write(response.content)

# Load the model from the .pkl file
with open("model.pkl", "rb") as file:
    model = joblib.load(file)

# Print the type of the loaded object
print(f"Loaded object type: {type(model)}")

# Define the input schema for prediction
class PredictionInput(BaseModel):
    City: int
    Day_of_Week: int
    Latitude: float
    Longitude: float
    Ride_Distance_KM: float
    Ride_Type: int
    Weather: int
    Event: int
    Payment_Type: int
    Available_Drivers: int
    User_Booking_Count: int
    Traffic_Density: float
    Previous_Surge: float
    Fare_Acceptance: float
    Demand_Level: float
    Surge_Multiplier: float
    Final_Fare: float
    Hour_of_Day: int
    Is_Weekend: int
    Real_Time_Demand: float
    Driver_Performance_Score: float
    Smart_Timeout: float
    AI_Demand_Prediction: float
    Driver_XP: float
    Ride_Priority: int
    Fare_Protection: int
    Year: int
    Month: int
    Day: int

# Define the input schema for distance calculation
class LocationRequest(BaseModel):
    source_lat: float
    source_lon: float
    destination: str

# OpenRouteService API Key
ORS_API_KEY = "5b3ce3597851110001cf6248b398e77b769346ccb99fe14362ece047"

# Convert address to latitude & longitude using Nominatim API
def get_coordinates(address: str):
    url = f"https://nominatim.openstreetmap.org/search?format=json&q={address}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        if data:
            # Filter results by importance (descending order)
            sorted_data = sorted(data, key=lambda x: x.get("importance", 0), reverse=True)
            location = sorted_data[0]  # Select the most important result
            return float(location["lat"]), float(location["lon"])
        else:
            print(f"No results found for address: {address}")
            return None, None
    except requests.exceptions.RequestException as e:
        print(f"Error fetching coordinates for address '{address}': {e}")
        return None, None
    except (KeyError, IndexError, ValueError) as e:
        print(f"Error parsing response for address '{address}': {e}")
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

# Prediction endpoint
@app.post("/predict")
def predict(input_data: PredictionInput):
    # Convert input data to a format the model expects
    features = [[
        input_data.City,
        input_data.Day_of_Week,
        input_data.Latitude,
        input_data.Longitude,
        input_data.Ride_Distance_KM,
        input_data.Ride_Type,
        input_data.Weather,
        input_data.Event,
        input_data.Payment_Type,
        input_data.Available_Drivers,
        input_data.User_Booking_Count,
        input_data.Traffic_Density,
        input_data.Previous_Surge,
        input_data.Fare_Acceptance,
        input_data.Demand_Level,
        input_data.Surge_Multiplier,
        input_data.Final_Fare,
        input_data.Hour_of_Day,
        input_data.Is_Weekend,
        input_data.Real_Time_Demand,
        input_data.Driver_Performance_Score,
        input_data.Smart_Timeout,
        input_data.AI_Demand_Prediction,
        input_data.Driver_XP,
        input_data.Ride_Priority,
        input_data.Fare_Protection,
        input_data.Year,
        input_data.Month,
        input_data.Day
    ]]
    
    # Make a prediction
    prediction = model.predict(features)
    
    # Return the prediction
    return {"prediction": prediction[0]}

# Distance calculation endpoint
@app.post("/get_distance")
async def calculate_distance(request: LocationRequest):
    dest_lat, dest_lon = get_coordinates(request.destination)
    if dest_lat is None or dest_lon is None:
        raise HTTPException(status_code=400, detail="Invalid destination address")
    
    distance = get_distance(request.source_lat, request.source_lon, dest_lat, dest_lon)
    if distance is None:
        raise HTTPException(status_code=500, detail="Error fetching distance")

    return {"distance": distance}

# Example analysis endpoint
@app.post("/analyze")
def analyze(input_data: PredictionInput):
    # Example: Use the DataFrame for analysis
    print(model.head())  # Example: Print the first few rows of the DataFrame
    return {"message": "DataFrame loaded successfully"}