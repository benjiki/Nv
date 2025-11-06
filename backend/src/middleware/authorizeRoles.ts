import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: number;
        role: string;
      };

      // Cast req to any to attach user
      (req as any).user = decoded;

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient role" });
      }

      next();
    } catch (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
  };
};
