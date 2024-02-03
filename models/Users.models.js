import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sanitizeHtml from "sanitize-html";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/, // Simple email format validation
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{10}$/, // Simple phone number format validation (10 digits)
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: true,
    },
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.JWT_SECRET || "your_secret_key",
    { expiresIn: "1h" } // Token expiration time
  );
  return token;
};

userSchema.methods.sanitizeUserInput = function () {
  this.name = sanitizeHtml(this.name);
  this.email = sanitizeHtml(this.email);
  this.address = sanitizeHtml(this.address);
  this.phoneNumber = sanitizeHtml(this.phoneNumber);
  this.userId = sanitizeHtml(this.userId);
  this.password = sanitizeHtml(this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
