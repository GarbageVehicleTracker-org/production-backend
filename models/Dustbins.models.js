// Dustbins.models.js

import mongoose from "mongoose";

const dustbinSchema = new mongoose.Schema({
  areaId: {
    type: String,
    required: true,
  },
  coordinates: [
    {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
  ],
  isVisited: {
    type: Boolean,
    required: true,
    default: false,
  },
  visitedTimestamp: {
    type: Date,
    default: null,
  },
});
const Dustbin = mongoose.model("Dustbin", dustbinSchema);

export default Dustbin;
