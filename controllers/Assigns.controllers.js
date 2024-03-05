// controllers/Assigns.controllers.js
import Assign from "../models/Assigns.model.js";
import Driver from "../models/Drivers.models.js";
import Vehicle from "../models/Vehicles.models.js";

class AssignController {
  
  async createAssign(req, res) {
    const { areaId, driverId, vehicleId } = req.body;

    try {
      // Check if there is existing assigned work for the given areaId
      const existingAssign = await Assign.findOne({ areaId });

      if (existingAssign) {
        // Check if the existing assigned work has the same driverId and vehicleId
        if (
          existingAssign.driverId === driverId &&
          existingAssign.vehicleId === vehicleId
        ) {
          // Do nothing if driverId and vehicleId match
          return res.status(200).json(existingAssign);
        } else {
          await Driver.findByIdAndUpdate(existingAssign.driverId, { isAvailable: true });
          await Vehicle.findByIdAndUpdate(existingAssign.vehicleId, { isAvailable: true });

          // Update the existing assigned work with the new driverId and vehicleId
          const updatedAssign = await Assign.findOneAndUpdate(
            { areaId },
            { driverId, vehicleId },
            { new: true }
          );

          // Set isAvailable to false for the assigned driver and vehicle
          await Driver.findByIdAndUpdate(driverId, { isAvailable: false });
          await Vehicle.findByIdAndUpdate(vehicleId, { isAvailable: false });

          return res.status(200).json(updatedAssign);
        }
      } else {
        // Create a new assigned work if no existing work for the given areaId
        const assign = new Assign({
          areaId,
          driverId,
          vehicleId,
        });

        const savedAssign = await assign.save();

        // Set isAvailable to false for the assigned driver and vehicle
        await Driver.findByIdAndUpdate(driverId, { isAvailable: false });
        await Vehicle.findByIdAndUpdate(vehicleId, { isAvailable: false });

        res.status(201).json(savedAssign);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteAssign(req, res) {
    const { assignId } = req.params;

    try {
        const assign = await Assign.findOne({ _id: assignId });

        if (!assign) {
            return res.status(404).json({ error: "Assign not found" });
        }

        // Set isAvailable to true for the assigned driver and vehicle
        await Driver.findByIdAndUpdate(assign.driverId, { isAvailable: true });
        await Vehicle.findByIdAndUpdate(assign.vehicleId, { isAvailable: true });

        // Delete the assignment document
        await Assign.deleteOne({ _id: assignId });

        res.status(200).json({ message: "Assign deleted successfully" });
    } catch (error) {
        console.error("Error deleting assign:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


  async getAssigns(req, res) {
    const { areaId } = req.params;

    try {
      if (areaId) {
        const assign = await Assign.findOne({ areaId });

        if (!assign) {
          return res.status(404).json({ error: "Assign not found" });
        }
        return res.status(200).json(assign);
      }

      const allAssigns = await Assign.find();
      res.status(200).json(allAssigns);
    } catch (error) {
      console.error("Error fetching assigns:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new AssignController();
