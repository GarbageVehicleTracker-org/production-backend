import { io } from "../server.js";

class CoordinatesController {
  updateCoordinates(req, res) {
    try {
      const { latitude, longitude } = req.body;

      if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      // Assuming you want to broadcast the coordinates to all connected clients
      io.emit("coordinatesUpdated", { latitude, longitude });

      return res.status(200).json({ message: "Coordinates updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new CoordinatesController();
