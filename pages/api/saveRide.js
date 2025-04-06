import dbConnect from "../../utils/dbConnect";
import Ride from "../../models/Ride";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { currentLocation, currentLat, currentLon, destination, distanceKm, predictedPrice } = req.body;

    try {
      // Connect to the database
      await dbConnect();

      // Validate required fields
      if (!currentLocation || !currentLat || !currentLon || !destination || !distanceKm || !predictedPrice) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Calculate final fare
      const basePrice = 30;
      const additionalChargePerKM = 15;
      const additionalDistance = distanceKm > 2 ? distanceKm - 2 : 0;
      const finalFare = Math.round(basePrice + additionalDistance * additionalChargePerKM);

      // Create a new ride document
      const ride = new Ride({
        currentLocation,
        currentLat,
        currentLon,
        destination,
        distanceKm,
        predictedPrice,
        finalFare,
      });

      // Save the ride to the database
      await ride.save();

      // Return a success response
      res.status(201).json({
        message: "Ride saved successfully",
        ride,
      });
    } catch (error) {
      console.error("Error saving ride:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}