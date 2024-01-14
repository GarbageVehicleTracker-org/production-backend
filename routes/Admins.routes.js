// Admins.routes.js
import express from "express";
import AdminController from "../controllers/Admins.controllers.js";
// import adminMiddleware from "../middlewares/admin.middleware.js"; // Corrected import path

// Admin routes
const adminRoutes = express.Router();

adminRoutes.post("/register", AdminController.createAdmin);

adminRoutes.get(
  "/get-all-admins/:username?",
  // adminMiddleware,
  AdminController.getAdmins
);

adminRoutes.post("/login", 
// adminMiddleware,
 AdminController.loginAdmin);

export default adminRoutes;
