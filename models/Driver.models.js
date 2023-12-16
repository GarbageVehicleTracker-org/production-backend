import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;
