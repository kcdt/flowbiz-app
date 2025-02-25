import { Request, Response } from 'express';
import { AuthModel } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { UserInput } from '../validation/user.validation';
import APIResponse from '../utils/response';
import { userModel } from '../models/user.model';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const userData: UserInput = req.body;
      
      const existingUser = await AuthModel.findUserByEmail(userData.email);
      if (existingUser) {
        return APIResponse(res, null, "Cet email est déjà utilisé", 400);
      }
      
      const hashedPassword = await AuthService.hashPassword(userData.password);
      
      const { password, ...userWithoutPassword } = userData;
      const userWithHashedPassword = { ...userWithoutPassword, passwordHash: hashedPassword };
      
      const newUser = await AuthModel.createUser(userWithHashedPassword);
      if (!newUser) {
        return APIResponse(res, null, "Erreur lors de la création de l'utilisateur", 500);
      } 
      const tokens = AuthService.generateTokens({ id: newUser.id, email: newUser.email });
      
      return APIResponse(res, { user: { id: newUser.id, email: newUser.email }, ...tokens }, "User register", 201);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },
  
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      const user = await AuthModel.findUserByEmail(email);
      if (!user) {
        return APIResponse(res, null, "Email ou mot de passe incorrect", 401);
      }
      const isMatch = await AuthService.comparePasswords(password, user.passwordHash);

      if (!isMatch) {
        return APIResponse(res, null, "Email ou mot de passe incorrect", 401);
      }

      const tokens = AuthService.generateTokens({ id: user.id, email: user.email });
      return APIResponse(res, { user: { id: user.id, email: user.email }, ...tokens }, "User logged", 201);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },
  
  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return APIResponse(res, null, "Token de rafraîchissement manquant", 400);
      }
      
      const decoded = AuthService.verifyRefreshToken(refreshToken);
      
      const user = await userModel.getById(decoded.id);
      if (!user) {
        return APIResponse(res, null, "Utilisateur non trouvé", 404);
      }
      
      const tokens = AuthService.generateTokens({ id: user.id, email: user.email });
      
      return APIResponse(res, tokens, "Token rafraichi", 201);
    } catch (error) {
      return APIResponse(res, null, "Token de rafraîchissement invalide", 401);
    }
  }
};