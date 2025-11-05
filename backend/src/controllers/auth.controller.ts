// apps/auth-service/src/controllers/auth.controller.ts
import { Request, Response } from "express";
import * as auth from "../services/auth.service";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await auth.regUserService(req.body);

    const { accessToken, refreshToken } = await auth.loginUserService(
      req.body.phoneNumber,
      req.body.password
    );

    res.status(201).json({
      message: "User registered successfully",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message || "Registration failed" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, password } = req.body;

    const { user, accessToken, refreshToken } = await auth.loginUserService(
      phoneNumber,
      password
    );

    res.json({
      message: "Login successful",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(401).json({ error: error.message || "Login failed" });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const { accessToken, refreshToken: newRefreshToken } =
      await auth.refreshAccessTokenService(refreshToken);

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: number };

    await auth.logoutUserService(user.id);

    res.json({ message: "Logged out successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Logout failed" });
  }
};
