// server.js (or app.js)

import dotenv from "dotenv";
import express from "express";
import connectToMongoDB from "./configs/MongoDB.config.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5500;

// Establish MongoDB connection
connectToMongoDB();

app.get("/", (req, res) => {
  res.send("My server listening");
});

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
