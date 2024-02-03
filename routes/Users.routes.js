//Users.routes.js
import express from "express";
import UserController from "../controllers/Users.controllers.js";
import userMiddleware from "../middlewares/user.middleware.js";
const userRoutes = express.Router();
// User routes
userRoutes.post("/create-user", userMiddleware, UserController.registerUser);
userRoutes.post("/login-user", userMiddleware, UserController.loginUser);
userRoutes.get("/get-users", userMiddleware, UserController.getUserProfile);
// userRoutes.get("/get-users/:id?", userMiddleware, UserController.getUsers);
userRoutes.put(
  "/update-user/:id?",
  userMiddleware,
  UserController.updateUserProfile
);
export default userRoutes;
