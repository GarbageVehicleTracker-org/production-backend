import express from "express";
import coordinatesController from "../controllers/Coordinates.controllers.js";
const coordinatesRoutes = express.Router();

coordinatesRoutes.post(
  "/send-coordinates",
  coordinatesController.updateCoordinates
);

export default coordinatesRoutes;
