import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authentification requise" });
    }
    
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
    };
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
};