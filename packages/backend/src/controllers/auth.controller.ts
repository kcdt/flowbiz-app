import { Request, Response } from 'express';
import { authModel } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { RegisterInput } from '../validation/user.validation';
import APIResponse from '../utils/response.utils';
import { userModel } from '../models/user.model';
import { VerifiedAuthRequest } from '../types/auth.types';
import { CreateCompanyInput } from '../validation/companies.validation';
import { companiesModel } from '../models/companies.model';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const formData: RegisterInput = req.body;

      const companyData: CreateCompanyInput = {
        name: formData.companyName,
        address: formData.companyAddress,
        phone: formData.companyPhone,
        email: formData.companyEmail,
        taxId: formData.taxId
      }

      const company = await companiesModel.createCompany(companyData);
      if (!company?.id) {
        return APIResponse(res, null, "Ereur lors de la création de l'entreprise", 400);
      }

      const existingUser = await userModel.getByEmail(formData.userEmail);
      if (existingUser) {
        return APIResponse(res, null, "Cet email est déjà utilisé", 400);
      }
      
      const hashedPassword = await AuthService.hashPassword(formData.password);
      
      const { password, ...userWithoutPassword } = formData;
      const userWithHashedPassword = { 
        ...userWithoutPassword,
        passwordHash: hashedPassword, 
        refreshToken: null,
        email: formData.userEmail,
        name: formData.userName,
        companyId: company.id
      };

      const newUser = await authModel.createUser(userWithHashedPassword);
      if (!newUser) {
        return APIResponse(res, null, "Erreur lors de la création de l'utilisateur", 500);
      }
      const tokens = AuthService.generateTokens({ id: newUser.id, email: newUser.email, role: newUser.role, companyId: newUser.companyId });

      await authModel.updateRefreshToken(newUser.id, tokens.refreshToken);
    
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      return APIResponse(res, { 
        user: { id: newUser.id, email: newUser.email, role: newUser.role }, 
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
  
      const tokens = AuthService.generateTokens({ id: user.id, email: user.email, role: user.role, companyId: user.companyId });
      
      await authModel.updateRefreshToken(user.id, tokens.refreshToken);
      
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      return APIResponse(res, { 
        user: { id: user.id, email: user.email, role: user.role }, 
        accessToken: tokens.accessToken 
      }, "User logged", 200);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },

  async logout(req: Request, res: Response) {
    try {      
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
      
      const tokens = AuthService.generateTokens({ id: user.id, email: user.email, role: user.role, companyId: user.companyId });
      
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
  },

  async getMe(req: Request, res: Response) {
    try {
      const authReq = req as VerifiedAuthRequest;
      const userId = authReq.user.id;
      
      if (!userId) {
        return APIResponse(res, null, "Utilisateur non authentifié", 401);
      }
      
      const user = await userModel.getById(userId);
      if (!user) {
        return APIResponse(res, null, "Utilisateur non trouvé", 404);
      }
      
      const { refreshToken, ...userWithoutSensitiveInfo } = user;
      
      return APIResponse(res, userWithoutSensitiveInfo, "Informations utilisateur récupérées", 200);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  }
};