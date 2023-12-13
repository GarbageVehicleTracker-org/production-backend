// require("dotenv").config();-
import express from "express";
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("My server listening");
});

app.listen(port, () => {
  console.log(` Server at http://localhost:${port}`);
});
