// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Extract the token from the request header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  try {
    // Verify the token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request
    req.user = decodedData;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    }

    console.error("Error verifying token:", error.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default authMiddleware;
