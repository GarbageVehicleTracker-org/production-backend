import express from "express";
import DriverController from "../controllers/Drivers.controllers.js";
import driverMiddleware from "../middlewares/driver.middleware.js";

const driverLoginRoutes = express.Router();
driverLoginRoutes.post("/login",driverMiddleware, DriverController.loginDriver);

export default driverLoginRoutes;