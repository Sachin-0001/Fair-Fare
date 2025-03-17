import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
});

userSchema.methods.comparePassword = async function (password) {
  // Implement password comparison logic here
  const bcrypt = require("bcrypt");
  return await bcrypt.compare(password, this.password);
};

// Check if the model already exists before defining it
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
