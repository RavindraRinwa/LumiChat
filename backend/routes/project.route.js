import { Router } from "express";
import { body } from "express-validator";
import * as projectController from "../controllers/project.controller.js";
import * as authMiddleware from "../middleware/auth_middleware.js";
const router = Router();

router.post(
  "/create",
  body("name").isString().withMessage("Project name is required"),
  authMiddleware.authUser,
  projectController.createProject
);

router.get("/all", authMiddleware.authUser, projectController.getAllProjects);

router.put(
  "/add-user",
  authMiddleware.authUser,
  body("projectId").isString().withMessage("Project ID is required"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users array is required")
    .custom((user) => user.every((u) => typeof u === "string")),
  projectController.addUserToProject
);

export default router;
