// Assigns.models.js
import mongoose from "mongoose";

const assignModel = mongoose.Schema(
  {
    areaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      unique: true,
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Assign = mongoose.model("Assign", assignModel);

export default Assign;
