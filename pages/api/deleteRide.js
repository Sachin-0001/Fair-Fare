import dbConnect from "../../utils/dbConnect";
import Ride from "../../models/Ride";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      // Connect to the database
      await dbConnect();

      // Extract the ID from the request body
        const { id } = req.body;

      // Validate the ID
      if (!id) {
        return res.status(400).json({ error: "Ride ID is required" });
      }

      // Find and delete the ride
      const deletedRide = await Ride.findByIdAndDelete(id);

      if (!deletedRide) {
        return res.status(404).json({ error: "Ride not found" });
      }

      // Return a success response
      res.status(200).json({
        message: "Ride deleted successfully",
        ride: deletedRide,
      });
    } catch (error) {
      console.error("Error deleting ride:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}