// Areas.models.js

import mongoose from "mongoose";
const areaSchema = new mongoose.Schema(
  {
    areaId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },

    dustbins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dustbin",
        // required: true,
      },
    ],
    dustbinsCount: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Area = mongoose.model("Area", areaSchema);

// module.exports = Area;
export default Area;
