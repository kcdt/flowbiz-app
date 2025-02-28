import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import APIResponse from "../utils/response.utils";
import { AuthRequest } from "../types/auth.types";

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return APIResponse(res, null, "Accès refusé. Token manquant", 401);
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        id: string;
        email: string;
        role: string;
        companyId: string;
      };
      
      (req as AuthRequest).user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return APIResponse(res, null, "Token expiré. Veuillez vous reconnecter", 401);
      }
      
      return APIResponse(res, null, "Token invalide", 401);
    }
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return APIResponse(res, null, "Erreur serveur lors de l'authentification", 500);
  }
};