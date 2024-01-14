import express from "express";
import AreaController from "../controllers/Areas.controllers.js";
import areaMiddleware from "../middlewares/area.middleware.js";

const areaRoutes = express.Router();

// Area routes
areaRoutes.post("/create-area", areaMiddleware, AreaController.createArea);

areaRoutes.get("/get-all-areas", areaMiddleware, AreaController.getAllAreas);

areaRoutes.get(
  "/get-area-details/:areaId?",
  areaMiddleware,
  AreaController.getAreaDetails
);

areaRoutes.put(
  "/update-area-details/:areaId?",
  areaMiddleware,
  AreaController.updateAreaDetails
);

export default areaRoutes;
