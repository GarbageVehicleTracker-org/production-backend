// // vehicles.controller.js

// import Vehicle from "../models/Vehicles.models.js";
// class VehicleController {
//   async createVehicle(req, res) {
//     const { id, capacity, type, registrationNo } = req.body;

//     try {
//       // Check if a vehicle with the same ID already exists
//       const existingVehicle = await Vehicle.findOne({ id });

//       if (existingVehicle) {
//         return res
//           .status(400)
//           .json({ error: "Vehicle with this ID already exists." });
//       }

//       // Create a new vehicle
//       const newVehicle = new Vehicle({
//         id,
//         capacity,
//         type,
//         registrationNo,
//       });

//       // Save the vehicle to the database
//       const savedVehicle = await newVehicle.save();

//       res.status(201).json(savedVehicle);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }

//   async getVehicle(req, res) {
//     const { id } = req.params;
//     console.log(id);
//     try {
//       // If id is provided, fetch individual vehicle
//       if (id) {
//         const vehicle = await Vehicle.findOne({ id });
//         if (!vehicle) {
//           return res.status(404).json({ error: "Vehicle not found" });
//         }
//         return res.status(200).json(vehicle);
//       }

//       // If no id is provided, fetch all vehicles
//       const allVehicles = await Vehicle.find();
//       res.status(200).json(allVehicles);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }
// }

// export default new VehicleController();

// vehicles.controller.js

import Vehicle from "../models/Vehicles.models.js";

const validateVehicle = (req) => {
  // Implement validation logic for id, capacity, type, and registrationNo
  // using mongoose validators or another library
  // Return an error object if validation fails
};

class VehicleController {
  async createVehicle(req, res) {
    const { id, capacity, type, registrationNo } = req.body;

    const validationError = validateVehicle(req);
    if (validationError) {
      return res.status(422).json({ error: validationError });
    }

    // Check if a vehicle with the same ID already exists
    const existingVehicle = await Vehicle.findOne({ id });

    if (existingVehicle) {
      return res
        .status(400)
        .json({ error: "Vehicle with this ID already exists." });
    }

    // Create a new vehicle
    const newVehicle = new Vehicle({
      id,
      capacity,
      type,
      registrationNo,
    });

    // Save the vehicle to the database
    const savedVehicle = await newVehicle.save();

    res.status(201).json({
      vehicle: savedVehicle,
      createdAt: savedVehicle.createdAt, // Additional data
    });
  }

  async getVehicles(req, res) {
    const { id } = req.params;

    try {
      // If id is provided, fetch individual vehicle
      if (id) {
        const vehicle = await Vehicle.findOne({ id }).populate(
          "// Related collections"
        ); // Optional populate
        if (!vehicle) {
          return res.status(404).json({ error: "Vehicle not found" });
        }
        return res.status(200).json(vehicle);
      }

      // If no id is provided, fetch all vehicles
      const allVehicles = await Vehicle.find();
      res.status(200).json(allVehicles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message }); // More specific error message
    }
  }

  async updateVehicle(req, res) {
    const { id } = req.params;
    const { capacity, type, registrationNo } = req.body;

    const validationError = validateVehicle(req);
    if (validationError) {
      return res.status(422).json({ error: validationError });
    }

    try {
      const vehicle = await Vehicle.findOne({ id });

      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }

      // Update the vehicle
      vehicle.capacity = capacity;
      vehicle.type = type;
      vehicle.registrationNo = registrationNo;

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
}

export default new VehicleController();
