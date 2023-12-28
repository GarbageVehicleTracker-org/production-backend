// utils/admin.utils.js
import jwt from "jsonwebtoken";
import Admin from "../models/Admins.models.js";

export const validateAdmin = (req) => {
  const { username, password } = req.body;

  // Example validation rules (adjust as needed)
  if (username.length < 5) {
    return "Username must be at least 5 characters long";
  }

  if (
    !password.match(/[a-z]/) ||
    !password.match(/[A-Z]/) ||
    !password.match(/[0-9]/)
  ) {
    return "Password must contain letters, numbers, and special characters";
  }

  // ...add more validation rules as needed
};

export const checkExistingAdmin = async (username) => {
  try {
    return await Admin.findOne({ username });
  } catch (error) {
    console.error("Error checking existing admin:", error);
    throw new Error("Internal server error");
  }
};

export const generateAdminToken = async (admin) => {
  try {
    // Generate a JWT token
    const token = jwt.sign(
      { username: admin.username, id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "20d" } // Set token expiration (adjust as needed)
    );

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Internal server error");
  }
};

