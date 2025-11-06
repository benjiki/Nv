// apps/auth-service/src/routes/auth.route.ts
import express, { Router } from "express";

import { authorizeRoles } from "../middleware/authorizeRoles";
import { validateRequest } from "../middleware/validateRequest";

import * as authController from "../controllers/auth.controller";
import * as validation from "../validations/auth.validations";

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

router.get(
  "/admin-only",
  authorizeRoles("Admin"), // only Admins
  (req, res) => {
    res.json({ message: "Welcome Admin!", user: req.user });
  }
);

export default router;
