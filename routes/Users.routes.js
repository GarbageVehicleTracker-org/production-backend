import express from "express";
import UsersControllers from "../controllers/Users.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/register", UsersControllers.registerUser);
router.post("/login", UsersControllers.loginUser);
router.get("/profile", authMiddleware, UsersControllers.getUserProfile);
router.put("/update-profile", authMiddleware, UsersControllers.updateUser);
router.put("/update-password", authMiddleware, UsersControllers.updatePassword);
router.post("/forgot-password", UsersControllers.forgotPassword);
// router.post("/reset-password", UsersControllers.resetPassword);
router.get(
  "/get-vehicles-drivers-details",
  authMiddleware,
  UsersControllers.getVehiclesDriversDetails
);

export default router;
