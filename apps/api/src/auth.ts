import type { Request, Response, NextFunction } from "express";
import { config } from "./config.js";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!config.adminApiKey) {
    return next();
  }

  const key = req.header("x-admin-key");

  if (key !== config.adminApiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}
