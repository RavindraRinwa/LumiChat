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
