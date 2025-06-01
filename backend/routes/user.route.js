import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import * as authMiddleware from "../middleware/auth_middleware.js";
import { body } from "express-validator";

const router = Router();

router.post(
  "/register",
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  userController.createUserController
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  userController.loginController
);

router.get(
  "/profile",
  authMiddleware.authUser,
  userController.profileController
);

router.get("/logout", authMiddleware.authUser, userController.logoutController);

router.get(
  "/all",
  authMiddleware.authUser,
  userController.getAllUsersController
);

export default router;
