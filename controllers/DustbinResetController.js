import Dustbin from "../models/Dustbins.models.js";
import { io } from "../server.js"; // Assuming you're using socket.io

class DustbinResetController {
  async resetAllDustbins() {
    try {
      // 1. Update the Dustbin Data
      const result = await Dustbin.updateMany({}, {
        $set: {
          isVisited: false,
          visitedTimestamp: null
        }
      });

      console.log(`${result.modifiedCount} dustbins reset.`);

      // 2. (Optional) Emit Socket.io Event
      if (result.modifiedCount > 0) {
        io.emit("dustbinsReset", { success: true });
      }

      return result; // Return the result for potential further processing
    } catch (error) {
      console.error("Error resetting dustbins:", error);
      throw error; // Or handle the error as needed in your application
    }
  }
}

export default new DustbinResetController();