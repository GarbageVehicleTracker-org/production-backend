// controllers/AdminController.js
import bcrypt from "bcryptjs";
import Admin from "../models/Admins.models.js";
import {
  checkExistingAdmin,
  generateAdminToken,
  validateAdmin,
} from "../utils/admin.utils.js";

class AdminController {
  async getAdmins(req, res) {
    try {
      const { username } = req.params;

      if (username) {
        const admin = await checkExistingAdmin(username);
        if (!admin) {
          return res.status(404).json({ error: "Admin not found" });
        }
        return res.status(200).json(admin);
      }

      const allAdmins = await Admin.find();
      res.status(200).json(allAdmins);
    } catch (error) {
      console.error("Error fetching admins:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async createAdmin(req, res) {
    try {
      const { username, password } = req.body;

      const validationError = validateAdmin(req);
      if (validationError) {
        return res.status(422).json({ error: validationError });
      }

      const existingAdmin = await checkExistingAdmin(username);
      if (existingAdmin) {
        return res
          .status(400)
          .json({ error: "Admin with this username already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({ username, password: hashedPassword });

      const savedAdmin = await newAdmin.save();

      res.status(201).json({
        admin: savedAdmin,
        createdAt: savedAdmin.createdAt,
      });
    } catch (error) {
      console.error("Error creating admin:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async loginAdmin(req, res) {
    try {
      const { username, password } = req.body;

      const existingAdmin = await checkExistingAdmin(username);
      if (!existingAdmin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingAdmin.password
      );

      if (!isPasswordCorrect) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = await generateAdminToken(existingAdmin);
      res.status(200).json({ result: existingAdmin, token });
    } catch (error) {
      console.error("Error logging in admin:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new AdminController();
