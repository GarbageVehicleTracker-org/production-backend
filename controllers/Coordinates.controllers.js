import { io } from "../server.js";

class CoordinatesController {
  updateCoordinates({ vehicleId, latitude, longitude }) {
    try {
      if (!vehicleId || !latitude || !longitude) {
        console.error("Vehicle ID, latitude, and longitude are required");
        return;
      }

      console.log(`Vehicle ${vehicleId}: ${latitude}, ${longitude}`);
      // Broadcast the coordinates along with the vehicleId to all connected clients
      io.emit("coordinatesUpdated", { vehicleId, latitude, longitude });

      console.log("Coordinates updated successfully");
    } catch (error) {
      console.error("Internal server error:", error);
    }
  }
}

export default new CoordinatesController();
