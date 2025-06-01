import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await userService.createUser(email, password);
    const token = await user.generateJWT();
    delete user._doc.password;
    return res.status(201).json({ user, token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }

    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }
    delete user._doc.password;
    const token = await user.generateJWT();
    return res.status(200).json({ user, token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const profileController = async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

export const logoutController = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
    redisClient.set(token, "logout", "EX", 60 * 60 * 24);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const LoggedInUser = await userModel.findOne({ email: req.user.email });
    const userId = LoggedInUser._id;
    const users = await userService.getAllUsers(userId);
    return res.status(200).json({ users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
