import Dustbin from "../models/Dustbins.models.js";
import Notification from "../models/Notification.models.js"; // Ensure the correct path to your Notification model
import { io } from "../server.js";

class CoordinatesMatchController {
  async updateCoordinates({ vehicleId, latitude, longitude }) {
    try {
      if (!vehicleId || !latitude || !longitude) {
        console.error("Vehicle ID, latitude, and longitude are required");
        return;
      }

      console.log(`Vehicle ${vehicleId}: ${latitude}, ${longitude}`);
      // Broadcast the coordinates along with the vehicleId to all connected clients
      io.emit("coordinatesUpdated", { vehicleId, latitude, longitude });

      // Fetch all dustbins from the database
      const dustbins = await Dustbin.find({ isVisited: false }); // Only fetch unvisited dustbins

      // Match the received coordinates with the existing array of points
      const matchedDustbins = dustbins.filter((dustbin) => {
        return dustbin.coordinates.some((point) => {
          // Adjust the threshold for matching coordinates to 5 decimal places
          const latDiff = Math.abs(point.latitude - latitude);
          const lonDiff = Math.abs(point.longitude - longitude);
          return latDiff < 0.0001 && lonDiff < 0.0001;
        });
      });

      // Update isVisited and visitedTimestamp for matched dustbins
      await Promise.all(
        matchedDustbins.map(async (matchedDustbin) => {
          matchedDustbin.isVisited = true;
          matchedDustbin.visitedTimestamp = new Date();
          await matchedDustbin.save();
          console.log("Dustbin matched and updated:", matchedDustbin._id);

          // Emit the update status to all connected clients
          io.emit("dustbinVisited", {
            id: matchedDustbin._id,
            isVisited: true,
          });

          // Create a notification for each matched dustbin
          const newNotification = new Notification({
            driverId: vehicleId,
            title: "Dustbin Visited",
            message: `Dustbin with ID ${matchedDustbin._id} has been visited by ${vehicleId}.`,
            isRead: false,
          });
          await newNotification.save();
          console.log("Notification created for dustbin:", matchedDustbin._id);
        })
      );

      console.log(
        "Coordinates updated and dustbins marked as visited successfully"
      );
    } catch (error) {
      console.error("Internal server error:", error);
    }
  }
}

export default new CoordinatesMatchController();
