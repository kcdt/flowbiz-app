import { Request, Response } from 'express';
import { authModel } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { UserInput } from '../validation/user.validation';
import APIResponse from '../utils/response.utils';
import { userModel } from '../models/user.model';
import { AuthRequest } from '../types/auth.types';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const userData: UserInput = req.body;
      
      const existingUser = await userModel.getByEmail(userData.email);
      if (existingUser) {
        return APIResponse(res, null, "Cet email est déjà utilisé", 400);
      }
      
      const hashedPassword = await AuthService.hashPassword(userData.password);
      
      const { password, ...userWithoutPassword } = userData;
      const userWithHashedPassword = { ...userWithoutPassword, passwordHash: hashedPassword, refreshToken: null };
      
      const newUser = await authModel.createUser(userWithHashedPassword);
      if (!newUser) {
        return APIResponse(res, null, "Erreur lors de la création de l'utilisateur", 500);
      } 
      const tokens = AuthService.generateTokens({ id: newUser.id, email: newUser.email });

      await authModel.updateRefreshToken(newUser.id, tokens.refreshToken);
    
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      return APIResponse(res, { 
        user: { id: newUser.id, email: newUser.email }, 
        accessToken: tokens.accessToken 
      }, "User register", 201);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },
  
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      const user = await userModel.getByEmail(email);
      if (!user) {
        return APIResponse(res, null, "Email ou mot de passe incorrect", 401);
      }
      const isMatch = await AuthService.comparePasswords(password, user.passwordHash);
  
      if (!isMatch) {
        return APIResponse(res, null, "Email ou mot de passe incorrect", 401);
      }
  
      const tokens = AuthService.generateTokens({ id: user.id, email: user.email });
      
      await authModel.updateRefreshToken(user.id, tokens.refreshToken);
      
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      return APIResponse(res, { 
        user: { id: user.id, email: user.email }, 
        accessToken: tokens.accessToken 
      }, "User logged", 200);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;
      
      if (userId) {
        await authModel.updateRefreshToken(userId, null);
      }
      
      res.clearCookie('refreshToken');
      
      return APIResponse(res, null, "Déconnexion réussie", 200);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return APIResponse(res, null, "Token de rafraîchissement manquant", 401);
      }
      
      const decoded = AuthService.verifyRefreshToken(refreshToken);
      const userId = decoded.id;
      
      const user = await userModel.getById(userId);
      if (!user || user.refreshToken !== refreshToken) {
        return APIResponse(res, null, "Token de rafraîchissement invalide", 401);
      }
      
      const tokens = AuthService.generateTokens({ id: user.id, email: user.email });
      
      await authModel.updateRefreshToken(userId, tokens.refreshToken);
      
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      return APIResponse(res, { accessToken: tokens.accessToken }, "Token rafraîchi", 200);
    } catch (error) {
      return APIResponse(res, null, "Token de rafraîchissement invalide", 401);
    }
  }
};