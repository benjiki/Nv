// apps/auth-service/src/routes/auth.route.ts
import express, { Router } from "express";

import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { validateRequest } from "../middleware/validateRequest.js";

import * as authController from "../controllers/auth.controller.js";
import * as validation from "../validations/auth.validations.js";

const router: Router = express.Router();

// Public routes
router.post(
  "/register",
  validateRequest(validation.registerValidationSchema),
  authController.registerUser
);

router.post(
  "/login",
  validateRequest(validation.loginValidationSchema),
  authController.loginUser
);

router.post("/refresh-token", authController.refreshAccessToken);

// Protected routes
router.post(
  "/logout",
  authorizeRoles(), // any authenticated user
  authController.logoutUser
);

router.get(
  "/me",
  authorizeRoles(), // any authenticated user
  authController.getMe
);
router.get("/users", authController.getAllUsersController);
router.get("/user/:id", authController.getUsersByIdController);
router.get("/users-stats", authController.getUsersCountController);
router.put("/user/:id", authController.usersUpdateController)
router.get(
  "/admin-only",
  authorizeRoles("Admin"), // only Admins
  (req, res) => {
    res.json({ message: "Welcome Admin!", user: req.user });
  }
);

export default router;
