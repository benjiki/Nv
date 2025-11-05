// apps/auth-service/src/routes/auth.route.ts
import express, { Router } from "express";
import passport from "passport";

import { authorizeRoles } from "../middleware/authorizeRoles";
import { validateRequest } from "../middleware/validateRequest";

import * as authController from "../controllers/auth.controller";
import * as validation from "../validations/auth.validations";

const router: Router = express.Router();

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

router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  authController.logoutUser
);
router.post("/refresh-token", authController.refreshAccessToken);
router.get(
  "/admin-only",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("Admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin!" });
  }
);

export default router;
