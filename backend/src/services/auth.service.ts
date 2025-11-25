// apps/auth-service/src/services/auth.service.ts
import { UserRoles, prisma } from "../prismaClient.js";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError.js";

// Registration

export const regUserService = async (data: {
  phoneNumber: string;
  password: string;
}) => {
  const userExists = await prisma.user.findUnique({
    where: { phoneNumber: data.phoneNumber },
  });
  if (userExists) {
    throw new Error("Phone number is already registered");
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      phoneNumber: data.phoneNumber,
      password: hashedPassword,
    },
  });
};

// Login
export const loginUserService = async (
  phoneNumber: string,
  password: string
) => {
  const user = await prisma.user.findUnique({ where: { phoneNumber } });

  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid password");

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

// Refresh Token
export const refreshAccessTokenService = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { id: number };

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (err) {
    throw new Error("Refresh token expired or invalid");
  }
};

// logout service

export const logoutUserService = async (userId: number) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};



export const getAllUsersService = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      phoneNumber: true,
      role: true,
      accountStatus: true,
    },
  });

  return users;
};

export const getUserByIdService = async (data: { id: number }) => {
  const user = await prisma.user.findUnique({
    where: {
      id: data.id
    },
    select: {
      id: true,
      phoneNumber: true,
      role: true,
      accountStatus: true,
    },
  })

  return user
}

export const usersUpdateService = async (data: {
  id: number
  phoneNumber: string;
  password: string;
}) => {
  const checkUser = await prisma.user.count({
    where: { id: Number(data.id) }
  })

  if (checkUser <= 0) {
    throw new ApiError(404, "User dose not exist")
  }

  const nameInUse = await prisma.user.findFirst({
    where: {
      phoneNumber: data.phoneNumber,
      NOT: { id: data.id }, // exclude the current user holder
    },
  });

  if (nameInUse) {
    throw new ApiError(400, "phoneNumber is already used by another user");
  }

  const updateUser = await prisma.user.update({
    where: { id: data.id }, data: {
      phoneNumber: data.phoneNumber,
      password: data.password
    }
  })

  return updateUser;
}

export const usersCountService = async () => {
  const users = await prisma.user.count();

  return users
}