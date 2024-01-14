import express from "express";
import DustbinController from "../controllers/Dustbins.controllers.js";
import areaMiddleware from "../middlewares/area.middleware.js";

// Dustbin routes
const dustbinRoutes = express.Router();
dustbinRoutes.post(
  "/create-dustbin",
  areaMiddleware,
  DustbinController.createDustbin
);

dustbinRoutes.get(
  "/get-all-dustbins/:areaId?",
  areaMiddleware,
  DustbinController.getAllDustbins
);

dustbinRoutes.get(
  "/get-middleCoordinates/:areaId?",
  areaMiddleware,
  DustbinController.getAllDustbinsCoordinates
);

export default dustbinRoutes;