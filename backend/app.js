import express from "express";
import morgan from "morgan";
import connectDB from "./db/db.js";
import userRoutes from "./routes/user.route.js";
import projectRoutes from "./routes/project.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/projects", projectRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});
app.use(morgan("dev"));

connectDB();

export default app;
