import express from "express";
import DriverController from "../controllers/Drivers.controllers.js";
import driverMiddleware from "../middlewares/driver.middleware.js";

// Driver routes
const driverRoutes = express.Router();
driverRoutes.post(
  "/create-driver",
  driverMiddleware,
  DriverController.createDriver
);

driverRoutes.get(
  "/get-all-drivers/:driverId?",
  driverMiddleware,
  DriverController.getDrivers
);

driverRoutes.put(
  "/update-driver/:driverId?",
  driverMiddleware,
  DriverController.updateDriver
);

driverRoutes.get(
  "/delete-driver/:driverId?",
  driverMiddleware,
  DriverController.deleteDriver
);

driverRoutes.post("/login", driverMiddleware, DriverController.loginDriver);
export default driverRoutes;
