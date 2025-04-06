import dbConnect from "../../utils/dbConnect";
import User from "../../models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      // Connect to the database
      await dbConnect();

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Compare passwords
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate a JWT
      const token = jwt.sign(
        { userId: user._id, role: user.role }, 
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );


      // Return the token and role
      res.status(200).json({
        message: "Login successful",
        token,
        role: user.role, 
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}