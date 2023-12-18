import express from "express";
import VehicleController from "../controllers/Vehicles.controllers.js";
import vehicleMiddleware from "../middlewares/vehicle.middleware.js";
const vehicleRoutes = express.Router();
// Vehicle routes
vehicleRoutes.post(
  "/create-vehicle",
  vehicleMiddleware,
  VehicleController.createVehicle
);
vehicleRoutes.get(
  "/get-vehicles",
  vehicleMiddleware,
  VehicleController.getVehicles
);
vehicleRoutes.get(
  "/get-vehicle/:id?",
  vehicleMiddleware,
  VehicleController.getVehicles
);
vehicleRoutes.put(
  "/update-vehicle/:id?",
  vehicleMiddleware,
  VehicleController.updateVehicle
);

export default vehicleRoutes;
