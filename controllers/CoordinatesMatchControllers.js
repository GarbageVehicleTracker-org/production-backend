// controllers/coordinatesMatchController.js

import Dustbin from "../models/Dustbins.models.js";
import Notification from "../models/Notification.models.js";
import { io } from "../server.js";

class CoordinatesMatchController {
  async updateCoordinates({ vehicleId, latitude, longitude }) {
    try {
      // Input Validation
      if (!vehicleId || !latitude || !longitude) {
        console.error("Missing required parameters: vehicleId, latitude, or longitude");
        return;
      }

      // Broadcast Coordinates
      io.emit("coordinatesUpdated", { vehicleId, latitude, longitude });

      // Fetch Unvisited Dustbins
      const dustbins = await Dustbin.find({ isVisited: false });

      // Match Coordinates
      const matchedDustbins = dustbins.filter((dustbin) => 
        dustbin.coordinates.some((point) => {
          const latDiff = Math.abs(point.latitude - latitude);
          const lonDiff = Math.abs(point.longitude - longitude);
          return latDiff < 0.00001 && lonDiff < 0.00001;
        })
      );

      // Update Dustbins and Create Notifications
      await Promise.all(matchedDustbins.map(async (dustbin) => {
        try {
          // Update Dustbin
          dustbin.isVisited = true;
          dustbin.visitedTimestamp = new Date();
          await dustbin.save();

          // Emit Dustbin Update
          io.emit("dustbinVisited", { id: dustbin._id, isVisited: true });

          // Create Notification
          const notification = new Notification({
            driverId: vehicleId,
            title: "Dustbin Visited",
            message: `Dustbin with ID ${dustbin._id} visited by vehicle ${vehicleId}`,
            isRead: false,
          });
          await notification.save();

          console.log(`Notification created for dustbin ${dustbin._id}`);
        } catch (notificationError) {
          console.error("Notification error:", notificationError.message);
          // Handle the error gracefully (e.g., retry, notify admin, etc.)
        }
      }));
    } catch (error) {
      console.error("Internal Server Error:", error);
      // Optionally, send an error response to the client
    }
  }
}

export default new CoordinatesMatchController();
