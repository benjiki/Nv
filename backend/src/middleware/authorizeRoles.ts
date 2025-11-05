// apps/auth-service/src/middleware/authorizeRoles.ts
import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { role?: string };

    if (!user || !allowedRoles.includes(user.role || "")) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }

    next();
  };
};
