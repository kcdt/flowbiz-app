import { Request, Response } from "express";
import { AuthModel } from "../models/auth.model";
import APIResponse from "../utils/response";

export const AuthController = {
  async register(req: Request, res: Response) {
    try {      
      const tokens = await AuthModel.register(req.body);
      
      return APIResponse(res, tokens, "Utilisateur créé avec succès", 201);
    } catch (error) {
      if (error instanceof Error) {
        return APIResponse(res, null, error.message, 400);
      }
      return APIResponse(res, null, "Erreur serveur", 500);
    }
  },
  
  async login(req: Request, res: Response) {
    try {      
      const { email, password } = req.body;
      
      const tokens = await AuthModel.login(email, password);
      
      return APIResponse(res, tokens, "Connexion réussie", 200);
    } catch (error) {
      if (error instanceof Error) {
        return APIResponse(res, null, error.message, 400);
      }
      return APIResponse(res, null, "Erreur serveur", 500);
    }
  },
  
  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return APIResponse(res, null, "Token de rafraîchissement manquant", 400);
      }
      
      const tokens = await AuthModel.refreshToken(refreshToken);
      
      return APIResponse(res, tokens, "Token rafraîchi avec succès", 200);
    } catch (error) {
      if (error instanceof Error) {
        return APIResponse(res, null, error.message, 401);
      }
      return APIResponse(res, null, "Erreur serveur", 500);
    }
  }
};