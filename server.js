import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";
import connectToMongoDB from "./configs/MongoDB.config.js";
import coordinatesMatchController from "./controllers/CoordinatesMatchControllers.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import adminRoutes from "./routes/Admins.routes.js";
import areaRoutes from "./routes/Areas.routes.js";
import assignRoutes from "./routes/Assigns.routes.js";
import coordinatesRoutes from "./routes/Coordinates.routes.js";
import driverLoginRoutes from "./routes/DriverLogin.routes.js";
import driverRoutes from "./routes/Drivers.routes.js";
import dustbinRoutes from "./routes/Dustbins.routes.js";
import NotificationRoutes from "./routes/Notification.routes.js";
import userRoutes from "./routes/Users.routes.js";
import vehicleRoutes from "./routes/Vehicles.routes.js";
import cron from "node-cron";
import DustbinResetController from "./controllers/DustbinResetController.js"; 

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "*",
      "http://localhost:5173",
      "https://garbagevehicletracker.github.io",
      "https://municipality-garbage-tracking.onrender.com",
      "https://production-backend-3olq.onrender.com",
      "https://dummy-vehicle.onrender.com",
      "https://frontend-teal-eta-10.vercel.app",
      "https://frontend-git-main-linuxs-projects.vercel.app",
      "https://frontend-mmjb4ntlh-linuxs-projects.vercel.app",
      "https://send-driver-1.onrender.com",
      "https://frontend-client-yyhr.onrender.com",
      "https://user-frontend-20ms.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("coordinatesUpdated", (data) => {
    const { vehicleId, latitude, longitude } = data;
    console.log(
      `Received coordinates for vehicle ${vehicleId}:`,
      latitude,
      longitude
    );
    coordinatesMatchController.updateCoordinates(data); // Call the controller function to handle the coordinates
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Use helmet for security headers
app.use(helmet());




cron.schedule("0 0 * * *", async () => { 
  console.log("Running scheduled dustbin reset...");
  try {
    await DustbinResetController.resetAllDustbins();
    console.log("Dustbins successfully reset.");
  } catch (error) {
    console.error("Error resetting dustbins:", error);
  }
});

// Configure CORS
app.use(
  cors({
    origin: [
      "*",
      "http://localhost:5173",
      "https://municipality-garbage-tracking.onrender.com",
      "https://garbagevehicletracker.github.io",
      "https://production-backend-3olq.onrender.com",
      "https://dummy-vehicle.onrender.com",
      "https://frontend-teal-eta-10.vercel.app",
      "https://frontend-git-main-linuxs-projects.vercel.app",
      "https://frontend-mmjb4ntlh-linuxs-projects.vercel.app",
      "https://send-driver-1.onrender.com",
      "https://frontend-client-yyhr.onrender.com",
      "https://user-frontend-20ms.onrender.com"
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

const port = process.env.PORT || 5500;

connectToMongoDB();

// Body parser middleware
app.use(express.json());

// Use your routes
app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/areas",  areaRoutes);
app.use("/dustbins", authMiddleware, dustbinRoutes);
app.use("/vehicles", authMiddleware, vehicleRoutes);
app.use("/drivers", authMiddleware, driverRoutes);
app.use("/driver-login", driverLoginRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/work", authMiddleware, assignRoutes);
app.use("/coordinates", coordinatesRoutes);
app.use("/updates", NotificationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error");
});

app.use((req, res) => {
  res.status(404).send("Not found");
});

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});

export { io }; // Export io for WebSocket usage in controllers
