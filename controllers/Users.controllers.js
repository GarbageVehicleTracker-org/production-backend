import bcrypt from "bcrypt";
import Assign from "../models/Assigns.model.js";
import User from "../models/Users.models.js";
class UserController {
  async registerUser(req, res) {
    try {
      const { name, email, password, phoneNumber, address, area, userId } =
        req.body;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        address,
        area,
        userId,
      });

      newUser.sanitizeUserInput();

      // const token = newUser.generateAuthToken();
      // newUser.token = token;

      const savedUser = await newUser.save();

      res.status(201).json({ user: savedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Check hashed password
      const isPasswordValid = await user.checkPassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = user.generateAuthToken();

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getUserProfile(req, res) {
    try {
      const user = await User.findById(req.user._id).populate("area", "name");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateUser(req, res) {
    try {
      const { name, phoneNumber, address, area } = req.body;

      // Find the user by ID
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update user details
      user.name = name || user.name;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.address = address || user.address;
      user.area = area || user.area;

      // Save the updated user
      const updatedUser = await user.save();

      res.status(200).json({ user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getVehiclesDriversDetails(req, res) {
    try {
      const user = await User.findById(req.user._id).populate("area", "name");
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const assign = await Assign.find({ areaId: user.area._id })
        .populate({
          path: "driverId",
          select: "name phoneNumbers image",
        })
        .populate({
          path: "vehicleId",
          select: "vehicleId capacity",
        });
  
      res.status(200).json({ assign });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  
}

export default new UserController();
