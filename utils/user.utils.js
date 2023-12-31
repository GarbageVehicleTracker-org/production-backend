import jwt from "jsonwebtoken";

export const generateAuthToken = async (user) => {
  try {
    // Generate a JWT token
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "20d" } // Set token expiration (adjust as needed)
    );

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Internal server error");
  }
};
