import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, licenseNumber, vehicleNumber } = req.body;

    try {
      // Connect to the database
      await dbConnect();
      console.log("Database connected");

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("User already exists");
        return res.status(400).json({ error: "User already exists" });
      }

      // Create a new user with the role set to "DRIVER"
      const user = new User({
        email,
        password,
        role: "DRIVER", // Automatically set the role to DRIVER
        licenseNumber,
        vehicleNumber,
      });

      await user.save();
      console.log("Driver created successfully:", user);

      res.status(201).json({ message: "Driver account created successfully" });
    } catch (error) {
      console.error("Error during driver signup:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}