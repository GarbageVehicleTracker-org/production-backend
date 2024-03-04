import express from "express";
import AssignController from "../controllers/Assigns.controllers.js";
import assignMiddleware from "../middlewares/assign.middleware.js";

// Assign routes
const assignRoutes = express.Router();

assignRoutes.post(
  "/create-assign",
  assignMiddleware,
  AssignController.createAssign
);

assignRoutes.get(
  "/get-all-assigns/:areaId?",
  assignMiddleware,
  AssignController.getAssigns
);

assignRoutes.post(
  "/delete-assign/:assignId?",
  assignMiddleware,
  AssignController.deleteAssign
);

export default assignRoutes;
