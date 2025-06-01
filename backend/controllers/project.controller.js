import projectModel from "../models/project.model.js";
import * as projectService from "../services/project.service.js";
import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";

export const createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;
  const loggedInUser = await userModel.findOne({ email: req.user.email });
  const userId = loggedInUser._id;

  try {
    const project = await projectService.createProject(name, userId);
    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const userId = loggedInUser._id;
    const allUserProjects = await projectService.getAllProjectsByUserId(userId);
    return res.status(200).json({ projects: allUserProjects });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addUserToProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { projectId, users } = req.body;
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const userId = loggedInUser._id;

    const project = await projectService.getAllProjectsByUserId(
      projectId,
      users,
      userId
    );
    return res.status(200).json({ project });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error adding user to project" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const userId = loggedInUser._id;

    const project = await projectService.getProjectById(projectId, userId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json({ project });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
