import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";
export const authUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized User" });
  }
  const isBlacklisted = await redisClient.get(token);

  if (isBlacklisted) {
    res.cookie(token, "");
    return res.status(401).json({ message: "Unauthorized User 2" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
