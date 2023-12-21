import Driver from "../models/Drivers.models.js"
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
      return res
        .status(400)
        .json({ error: "Driver with this ID already exists." });
    }

    // Create a new driver
    const newDriver = new Driver({
      driverId,
      name,
      phoneNumbers,
      age,
      gender,
      image,
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
        const driver = await Driver.findOne({ driverId });

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
      const driver = await Driver.findOne({ driverId });

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
      const result = await Driver.deleteOne({ driverId });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Driver not found' });
      }
  
      res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (error) {
      console.error('Error deleting driver:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
}

export default new DriverController();
