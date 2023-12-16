// MongoDB.config.js (db.js)

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectToMongoDB;
