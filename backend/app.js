import express from "express";
import morgan from "morgan";
import connectDB from "./db/db.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});
app.use(morgan("dev"));

connectDB();

export default app;
