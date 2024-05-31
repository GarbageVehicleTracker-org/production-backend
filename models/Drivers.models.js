// Drivers.models.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the driver schema
const driverSchema = new mongoose.Schema(
  {
    driverId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumbers: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

driverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
