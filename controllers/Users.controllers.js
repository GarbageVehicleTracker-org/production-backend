import bcrypt from "bcrypt";
import User from "../models/User.model.js";

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

      const token = newUser.generateAuthToken();
      newUser.token = token;

      const savedUser = await newUser.save();

      res.status(201).json({ user: savedUser, token });
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

  async googleSignIn(req, res) {
    const { googleIdToken } = req.body;

    try {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: googleIdToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const { sub: googleUserId, email, name } = ticket.getPayload();

      let user = await User.findOne({ googleUserId });

      if (!user) {
        user = new User({
          name,
          email,
          googleIdToken,
          userId: `google_${googleUserId}`,
        });

        const token = user.generateAuthToken();
        user.token = token;

        await user.save();
      }

      const token = user.generateAuthToken();

      res.status(200).json({ message: "Google Sign-In successful", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new UserController();
