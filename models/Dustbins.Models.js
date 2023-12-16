// Dustbins.models.js
import mongoose from "mongoose";

const dustbinSchema = new mongoose.Schema({
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

module.exports = Dustbin;
