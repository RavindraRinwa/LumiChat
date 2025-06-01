import mongoose from "mongoose";
import projectModel from "../models/project.model.js";

export const createProject = async (name, userId) => {
  if (!name || !userId) {
    throw new Error("Project name and user ID are required");
  }
  try {
    const project = await projectModel.create({ name, users: [userId] });
    await project.save();
    return project;
  } catch (error) {
    throw new Error("Error creating project");
  }
};

export const getAllProjectsByUserId = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  try {
    const projects = await projectModel.find({ users: userId });
    return projects;
  } catch (error) {
    throw new Error("Error fetching projects");
  }
};

export const addUserToProject = async (projectId, users, userId) => {
  if (!projectId || !users || !Array.isArray(users)) {
    throw new Error("Project ID and users array are required");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }
  if (!userId) {
    throw new Error("User ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }
  try {
    const project = await projectModel.findOne({
      _id: projectId,
      users: userId,
    });
    if (!project) {
      throw new Error("Project not found");
    }
    const updatedProject = await projectModel.findByIdAndUpdate(
      projectId,
      { $addToSet: { users: { $each: users } } },
      { new: true }
    );
    return updatedProject;
  } catch (error) {
    throw new Error("Error adding user to project");
  }
};

export const getProjectById = async (projectId, userId) => {
  if (!projectId || !userId) {
    throw new Error("Project ID and user ID are required");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }
  try {
    const project = await projectModel
      .findOne({
        _id: projectId,
        users: userId,
      })
      .populate("users", "email name");
    if (!project) {
      throw new Error("Project not found or you do not have access");
    }
    return project;
  } catch (error) {
    throw new Error("Error fetching project by ID");
  }
};
