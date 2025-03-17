// utils/dbConnect.js
import mongoose from "mongoose";

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Already connected to the database");
    return;
  }

  try {
    console.log("Attempting to connect to the database...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to connect to the database");
  }
};

export default dbConnect;
