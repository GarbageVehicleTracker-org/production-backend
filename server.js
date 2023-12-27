// server.js

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectToMongoDB from "./configs/MongoDB.config.js";
import authMiddleware from "./middlewares/auth.middleware.js"
import adminRoutes from "./routes/Admins.routes.js";
import areaRoutes from "./routes/Areas.routes.js";
import driverRoutes from "./routes/Drivers.routes.js";
import dustbinRoutes from "./routes/Dustbins.routes.js";
import vehicleRoutes from "./routes/Vehicles.routes.js";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(
  cors({
    origin: "https://municipality-garbage-tracking.onrender.com",
  })
);

const port = process.env.PORT || 5500;

connectToMongoDB();

// Body parser middleware
app.use(express.json());

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // You can add more WebSocket event handling here
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Use your routes
app.get("/", (req, res) => {
  res.send("My server listening");
});
app.use("/areas", authMiddleware, areaRoutes);
app.use("/dustbins", authMiddleware, dustbinRoutes);
app.use("/vehicles", authMiddleware, vehicleRoutes);
app.use("/drivers", authMiddleware, driverRoutes);
app.use("/admin", authMiddleware, adminRoutes);

server.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});

export { io }; // Export io for WebSocket usage in controllers
