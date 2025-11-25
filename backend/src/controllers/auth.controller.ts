// /src/controllers/auth.controller.ts
import { Request, Response } from "express";
import * as auth from "../services/auth.service.js";
import { UserRoles, prisma } from "../prismaClient.js";
import { ApiSuccess } from "../utils/ApiError.js";
import { updateUserValidationSchema, userParamSchema } from "../validations/auth.validations.js";
import { io } from "../index.js";

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

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phoneNumber: true,
        role: true,
        accountStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch user" });
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


export const getAllUsersController = async (req: Request, res: Response) => {

  const allUsers = await auth.getAllUsersService()

  res.status(200).json(new ApiSuccess(allUsers))
}


export const getUsersByIdController = async (req: Request, res: Response) => {
  const { error: paramError, value: paramValue } = userParamSchema.validate(req.params);

  if (paramError) {
    const messages = [
      ...(paramError?.details.map((err) => err.message) || [])
    ];
    return res.status(400).json({
      error: messages.join(", "),
    });
  }

  const users = await auth.getUserByIdService({ id: paramValue.id })

  res.status(200).json(new ApiSuccess(users))
}

export const getUsersCountController = async (req: Request, res: Response) => {
  const usersStat = await auth.usersCountService()

  res.status(200).json(new ApiSuccess(usersStat))
}

export const usersUpdateController = async (req: Request, res: Response) => {
  // Validate the body and the params
  const { error: bodyError, value: bodyValue } = updateUserValidationSchema.validate(req.body);
  const { error: paramError, value: paramValue } = userParamSchema.validate(req.params);

  // If there's an error in the request body or params, return an error response
  if (bodyError || paramError) {
    const messages = [
      ...(bodyError?.details.map((err) => err.message) || []),
      ...(paramError?.details.map((err) => err.message) || [])
    ];
    return res.status(400).json({
      error: messages.join(", "),
    });
  }

  const accountHolder = await auth.usersUpdateService({
    id: paramValue.id,
    ...bodyValue
  });
  io.emit("usersUpdated");
  res.status(201).json(new ApiSuccess(accountHolder, "User updated successfully"));

}