import express from "express";
import CoordinatesMatchController from "../controllers/CoordinatesMatchControllers.js";
const coordinatesRoutes = express.Router();

coordinatesRoutes.post(
  "/send-coordinates",
  CoordinatesMatchController.updateCoordinates
);

export default coordinatesRoutes;
