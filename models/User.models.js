// models/User.model.js

import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
