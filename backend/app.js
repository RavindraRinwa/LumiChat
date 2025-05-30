import express from "express";
import morgan from "morgan";
import connectDB from "./db/db.js";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/users", userRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});
app.use(morgan("dev"));

connectDB();

export default app;
