import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      // Connect to the database
      await dbConnect();
      console.log(User);
      console.log("Database connected");

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("User already exists");
        return res.status(400).json({ error: "User already exists" });
      }

      // Create a new user with the role set to "USER"
      const user = new User({
        email,
        password,
        role: "USER", // Automatically set the role to USER
      });

      await user.save();
      console.log("User created successfully:", user);

      res.status(201).json({ message: "User account created successfully" });
    } catch (error) {
      console.error("Error during user signup:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}