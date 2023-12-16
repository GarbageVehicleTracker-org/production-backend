// vehicle.model.js
import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    registrationNo: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
