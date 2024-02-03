// controllers/Vehicles.controllers.js
import mongoose from "mongoose";
import Vehicle from "../models/Vehicles.models.js";

const validateVehicle = (req) => {
  const { vehicleId, capacity, type, registrationNo } = req.body;

  // Add validation rules as needed
  if (!vehicleId || !capacity || !type || !registrationNo) {
    return { error: "Please provide all required fields" };
  }

  // Add more validation rules...

  return null; // Validation passed
};

class VehicleController {
  async createVehicle(req, res) {
    try {
      const validationError = validateVehicle(req);
      if (validationError) {
        return res.status(400).json({ error: validationError.error });
      }

      const { vehicleId, capacity, type, registrationNo } = req.body;

      // Generate a unique ID
      const newVehicle = new Vehicle({
        // _id: new mongoose.Types.ObjectId(),
        vehicleId,
        capacity,
        type,
        registrationNo,
      });

      const savedVehicle = await newVehicle.save();

      res.status(201).json(savedVehicle);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        // Handle validation errors
        const validationErrors = Object.values(error.errors).map(
          (err) => err.message
        );
        return res.status(400).json({ error: validationErrors });
      }

      console.error("Error creating vehicle:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getVehicles(req, res) {
    const { vehicleId } = req.params;

    try {
      if (vehicleId) {
        const vehicle = await Vehicle.findOne({ vehicleId });

        if (!vehicle) {
          return res.status(404).json({ error: "Vehicle not found" });
        }
        return res.status(200).json(vehicle);
      }

      const allVehicles = await Vehicle.find();
      res.status(200).json(allVehicles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message }); // More specific error message
    }
  }

  async updateVehicle(req, res) {
    const { vehicleId } = req.params;
    const { capacity, type, registrationNo } = req.body;

    const validationError = validateVehicle(req);
    if (validationError) {
      return res.status(422).json({ error: validationError });
    }

    try {
      const vehicle = await Vehicle.findOne({ vehicleId });

      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }

      // Update the properties if provided
      if (capacity !== undefined) {
        vehicle.capacity = capacity;
      }

      if (type !== undefined) {
        vehicle.type = type;
      }

      if (registrationNo !== undefined) {
        vehicle.registrationNo = registrationNo;
      }

      // Save the updated vehicle
      const savedVehicle = await vehicle.save();

      res.status(200).json({
        vehicle: savedVehicle,
        updatedAt: savedVehicle.updatedAt, // Additional data
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message }); // More specific error message
    }
  }

  async deleteVehicle(req, res) {
    const { vehicleId } = req.params;

    try {
      const vehicle = await Vehicle.findOne({ vehicleId });

      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }

      await vehicle.remove();

      res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message }); 
    }
  }
}

export default new VehicleController();
