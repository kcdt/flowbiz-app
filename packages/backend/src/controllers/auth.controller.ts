import { Request, Response } from 'express';
import { authModel } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { UserInput } from '../validation/user.validation';
import APIResponse from '../utils/response.utils';
import { userModel } from '../models/user.model';
import { AuthRequest } from '../types/auth.types';
import { CreateCompanyInput } from '../validation/companies.validation';
import { companiesModel } from '../models/companies.model';
import { logger } from '../utils/logger.utils';

const ERROR_MESSAGES = {
  COMPANY_CREATION: "Erreur lors de la création de l'entreprise",
  EMAIL_ALREADY_USED: "Cet email est déjà utilisé",
  USER_CREATION: "Erreur lors de la création de l'utilisateur",
  INVALID_CREDENTIALS: "Email ou mot de passe incorrect",
  MISSING_REFRESH_TOKEN: "Token de rafraîchissement manquant",
  INVALID_REFRESH_TOKEN: "Token de rafraîchissement invalide",
  USER_NOT_AUTHENTICATED: "Utilisateur non authentifié",
  USER_NOT_FOUND: "Utilisateur non trouvé",
  INTERNAL_SERVER_ERROR: "Une erreur interne s'est produite"
};

const SUCCESS_MESSAGES = {
  USER_REGISTERED: "Inscription réussie",
  USER_LOGGED_IN: "Connexion réussie",
  USER_LOGGED_OUT: "Déconnexion réussie",
  TOKEN_REFRESHED: "Token rafraîchi",
  USER_PROFILE_RETRIEVED: "Profil utilisateur récupéré"
};

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { 
        userEmail, 
        userName, 
        userPhone, 
        companyName, 
        companyAddress, 
        companyPhone, 
        companyEmail, 
        taxId, 
        password 
      } = req.body;

      const existingUser = await userModel.getByEmail(userEmail);
      if (existingUser) {
        return APIResponse(res, null, ERROR_MESSAGES.EMAIL_ALREADY_USED, 400);
      }

      const companyData: CreateCompanyInput = { 
        name: companyName, 
        address: companyAddress, 
        phone: companyPhone, 
        email: companyEmail, 
        taxId 
      };

      const company = await companiesModel.createCompany(companyData);
      if (!company) {
        logger.error('Échec de la création de l\'entreprise', { companyEmail });
        return APIResponse(res, null, ERROR_MESSAGES.COMPANY_CREATION, 400);
      }

      const userData: UserInput = { 
        email: userEmail, 
        name: userName, 
        role: "admin_seller", 
        password, 
        companyId: company.id, 
        phone: userPhone 
      };
      
      const hashedPassword = await AuthService.hashPassword(userData.password);
      
      const { password: _, ...userWithoutPassword } = userData;
      const userWithHashedPassword = { 
        ...userWithoutPassword, 
        passwordHash: hashedPassword, 
        refreshToken: null 
      };
      
      const newUser = await authModel.createUser(userWithHashedPassword);
      if (!newUser) {
        // Si la création de l'utilisateur échoue, il faudrait idéalement supprimer l'entreprise créée
        logger.error('Échec de la création de l\'utilisateur après création de l\'entreprise', { userEmail, companyId: company.id });
        return APIResponse(res, null, ERROR_MESSAGES.USER_CREATION, 500);
      }

      const tokens = AuthService.generateTokens({ 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role, 
        companyId: newUser.companyId 
      });

      await authModel.updateRefreshToken(newUser.id, tokens.refreshToken);
    
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/auth/refresh'
      });
      
      return APIResponse(res, { 
        user: { id: newUser.id, email: newUser.email, role: newUser.role }, 
        accessToken: tokens.accessToken 
      }, SUCCESS_MESSAGES.USER_REGISTERED, 201);
    } catch (error: any) {
      logger.error('Erreur lors de l\'inscription', { error: error.message, stack: error.stack });
      return APIResponse(res, null, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
    }
  },
  
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return APIResponse(res, null, ERROR_MESSAGES.INVALID_CREDENTIALS, 400);
      }
      
      const user = await userModel.getByEmail(email);
      if (!user) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return APIResponse(res, null, ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
      }

      const isMatch = await AuthService.comparePasswords(password, user.passwordHash);
      if (!isMatch) {
        logger.warn('Tentative de connexion échouée', { email });
        return APIResponse(res, null, ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
      }
  
      const tokens = AuthService.generateTokens({ 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        companyId: user.companyId 
      });
      
      await authModel.updateRefreshToken(user.id, tokens.refreshToken);
      
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/auth/refresh'
      });      
      
      return APIResponse(res, { 
        user: { id: user.id, email: user.email, role: user.role }, 
        accessToken: tokens.accessToken 
      }, SUCCESS_MESSAGES.USER_LOGGED_IN, 200);
    } catch (error: any) {
      logger.error('Erreur lors de la connexion', { error: error.message, stack: error.stack });
      return APIResponse(res, null, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      
      if (authReq.user?.id) {
        await authModel.updateRefreshToken(authReq.user.id, null);
      }
      
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/auth/refresh'
      });
      
      return APIResponse(res, null, SUCCESS_MESSAGES.USER_LOGGED_OUT, 200);
    } catch (error: any) {
      logger.error('Erreur lors de la déconnexion', { error: error.message, stack: error.stack });
      return APIResponse(res, null, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return APIResponse(res, null, ERROR_MESSAGES.MISSING_REFRESH_TOKEN, 401);
      }
      
      const decoded = AuthService.verifyRefreshToken(refreshToken);
      if (!decoded || !decoded.id) {
        return APIResponse(res, null, ERROR_MESSAGES.INVALID_REFRESH_TOKEN, 401);
      }
      
      const userId = decoded.id;
      
      const user = await userModel.getById(userId);
      if (!user || user.refreshToken !== refreshToken) {
        return APIResponse(res, null, ERROR_MESSAGES.INVALID_REFRESH_TOKEN, 401);
      }
      
      const tokens = AuthService.generateTokens({ 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        companyId: user.companyId 
      });
      
      await authModel.updateRefreshToken(userId, tokens.refreshToken);
      
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/auth/refresh'
      });
      
      return APIResponse(res, { accessToken: tokens.accessToken }, SUCCESS_MESSAGES.TOKEN_REFRESHED, 200);
    } catch (error: any) {
      logger.error('Erreur lors du rafraîchissement du token', { error: error.message, stack: error.stack });
      return APIResponse(res, null, ERROR_MESSAGES.INVALID_REFRESH_TOKEN, 401);
    }
  },

  async getMe(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;

      if (!authReq.user) {
        return APIResponse(res, null, ERROR_MESSAGES.USER_NOT_AUTHENTICATED, 401);
      }
      
      const user = await userModel.getById(authReq.user.id);
      if (!user) {
        logger.warn('Utilisateur authentifié non trouvé en base', { userId: authReq.user.id });
        return APIResponse(res, null, ERROR_MESSAGES.USER_NOT_FOUND, 404);
      }
      
      const { refreshToken, ...userData } = user;
      
      return APIResponse(res, userData, SUCCESS_MESSAGES.USER_PROFILE_RETRIEVED, 200);
    } catch (error: any) {
      logger.error('Erreur lors de la récupération du profil', { error: error.message, stack: error.stack });
      return APIResponse(res, null, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
    }
  }
};