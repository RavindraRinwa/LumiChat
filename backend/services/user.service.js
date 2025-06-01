import userModel from "../models/user.model.js";
export const createUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = new userModel({
    email,
    password: hashedPassword,
  });
  await user.save();
  return user;
};

export const getAllUsers = async (userId) => {
  const users = await userModel
    .find({ _id: { $ne: userId } })
    .select("-password");
  return users;
};

export default createUser;
