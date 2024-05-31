// driver.controllers.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Driver from "../models/Drivers.models.js";
import Assign from "../models/Assigns.model.js";

const validateDriver = (req) => {
  // Implement validation logic for id, name, and phoneNumbers
  // using mongoose validators or another library
  // Return an error object if validation fails
};

class DriverController {
  async createDriver(req, res) {
    const { driverId, name, phoneNumbers, age, gender, image } = req.body;

    const validationError = validateDriver(req);
    if (validationError) {
      return res.status(422).json({ error: validationError });
    }

    // Check if a driver with the same ID already exists
    const existingDriver = await Driver.findOne({ driverId });

    if (existingDriver) {
      return res.status(400).json({ error: "Driver with this ID already exists." });
    }
    const formattedName = name.replace(/\s+/g, '');

    // Generate a simple password (e.g., "Driver@1234")
    const password = `${formattedName}@${phoneNumbers.substring(phoneNumbers.length - 4)}`;

    // Create a new driver
    const newDriver = new Driver({
      driverId,
      name,
      phoneNumbers,
      age,
      gender,
      image,
      password,
    });

    // Save the driver to the database
    const savedDriver = await newDriver.save();

    res.status(201).json({
      driver: savedDriver,
      createdAt: savedDriver.createdAt, // Additional data
    });
  }

  async getDrivers(req, res) {
    const { driverId } = req.params;

    try {
      if (driverId) {
        const driver = await Driver.findById(driverId);

        if (!driver) {
          return res.status(404).json({ error: "Driver not found" });
        }
        return res.status(200).json(driver);
      }

      const allDrivers = await Driver.find();
      res.status(200).json(allDrivers);
    } catch (error) {
      console.error("Error getting all drivers:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateDriver(req, res) {
    const { driverId } = req.params;
    const { name, phoneNumbers, age, gender, image } = req.body;

    const validationError = validateDriver(req);
    if (validationError) {
      return res.status(422).json({ error: validationError });
    }

    try {
      const driver = await Driver.findById(driverId);

      if (!driver) {
        return res.status(404).json({ error: "Driver not found" });
      }

      // Update the properties if provided
      if (name !== undefined) {
        driver.name = name;
      }

      if (phoneNumbers !== undefined) {
        driver.phoneNumbers = phoneNumbers;
      }
      if (age !== undefined) {
        driver.age = age;
      }
      if (gender !== undefined) {
        driver.gender = gender;
      }
      if (image !== undefined) {
        driver.image = image;
      }

      // Save the updated driver
      const updatedDriver = await driver.save();

      res.status(200).json({
        driver: updatedDriver,
        updatedAt: updatedDriver.updatedAt, // Additional data
      });
    } catch (error) {
      console.error("Error updating driver:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteDriver(req, res) {
    const { driverId } = req.params;

    try {
      const result = await Driver.deleteOne({ _id: driverId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Driver not found' });
      }

      res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (error) {
      console.error('Error deleting driver:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async loginDriver(req, res) {
    const { driverId, password } = req.body;
  
    try {
      const driver = await Driver.findOne({ driverId });
      const driver_id = driver._id;
  
      if (!driver) {
        return res.status(404).json({ error: "Driver not found" });
      }
  
      const isMatch = await bcrypt.compare(password, driver.password);
  
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const token = jwt.sign({ driverId: driver.driverId }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      // Check if assignData exists before accessing properties
      let assignData = null;
      try {
        assignData = await Assign.findOne({ driverId: driver_id });
      } catch (error) {
        console.error("Error fetching assigned data:", error);
      }
  
      res.status(200).json({
        message: "Login successful",
        token,
        driverId: driver.driverId,
        name: driver.name,
        vehicleId: assignData?.vehicleId, // Use optional chaining
        areaId: assignData?.areaId, // Use optional chaining
        driverImage: driver.image,
        
      });
    } catch (error) {
      console.error("Error logging in driver:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  
}

export default new DriverController();
