import mongoose, { Schema } from "mongoose";

const rideSchema = new Schema(
  {
    currentLocation: { type: String, required: true }, // Address of the user's current location
    currentLat: { type: Number, required: true }, // Latitude of the user's current location
    currentLon: { type: Number, required: true }, // Longitude of the user's current location
    destination: { type: String, required: true }, // Destination address entered by the user
    distanceKm: { type: Number, required: true }, // Distance of the ride in kilometers
    predictedPrice: { type: Number, required: true }, // Predicted price for the ride
    finalFare: { type: Number, required: true }, // Final fare for the ride
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Check if the model already exists before defining it
const Ride = mongoose.models.Ride || mongoose.model("Ride", rideSchema);

export default Ride;