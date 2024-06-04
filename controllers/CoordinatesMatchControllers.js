import Dustbin from "../models/Dustbins.models.js";
import Notification from "../models/Notification.models.js";
import { io } from "../server.js";

class CoordinatesMatchController {
  async updateCoordinates({ vehicleId, latitude, longitude }) {
    try {
      // Input Validation (Essential)
      if (!vehicleId || !latitude || !longitude) {
        console.error("Missing required parameters: vehicleId, latitude, or longitude");
        return; 
      }

      // Broadcast Coordinates (Optional)
      io.emit("coordinatesUpdated", { vehicleId, latitude, longitude });

      // Fetch Unvisited Dustbins (Efficiency)
      const dustbins = await Dustbin.find({ isVisited: false });

      // Match Coordinates (Accuracy)
      const matchedDustbins = dustbins.filter((dustbin) => {
        return dustbin.coordinates.some((point) => {
          const latDiff = Math.abs(point.latitude - latitude);
          const lonDiff = Math.abs(point.longitude - longitude);
          return latDiff < 0.00001 && lonDiff < 0.00001; // Adjust threshold if needed
        });
      });

      // Update and Notify (Atomicity)
      await Promise.all(
        matchedDustbins.map(async (dustbin) => {
          try {
            // Update Dustbin
            dustbin.isVisited = true;
            dustbin.visitedTimestamp = new Date();
            await dustbin.save();

            // Emit Dustbin Update (Optional)
            io.emit("dustbinVisited", { id: dustbin._id, isVisited: true });

            // Create Notification
            const notification = new Notification({
              driverId: vehicleId,
              title: "Dustbin Visited",
              message: `Dustbin with ID ${dustbin._id} visited by vehicle ${vehicleId}`,
              isRead: false,
            });
            await notification.save(); // Await is crucial here
            
            console.log(`Notification created for dustbin ${dustbin._id}`);
          } catch (notificationError) {
            console.error("Notification error:", notificationError.message, notificationError);
            // Handle the error gracefully (e.g., retry, notify admin, etc.)
          }
        })
      );
    } catch (error) {
      console.error("Internal Server Error:", error);
      // Consider sending an error response to the client
    }
  }
}

export default new CoordinatesMatchController();
