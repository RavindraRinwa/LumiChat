import userModel from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import { validationResult } from "express-validator";
export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await createUser(email, password);
    const token = await user.generateJWT();
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

    const token = await user.generateJWT();
    return res.status(200).json({ user, token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
