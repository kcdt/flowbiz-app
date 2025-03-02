import { Request, Response, NextFunction } from 'express';
import { VerifiedAuthRequest } from '../types/auth.types';
import APIResponse from '../utils/response.utils';
import { userModel } from '../models/user.model';

export const checkUserCompany = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as VerifiedAuthRequest;
  const userCompanyId = authReq.user.companyId;
  const userId = req.params.id;
  
  if (!userId) {
    return APIResponse(res, null, "ID de user non fourni", 400);
  }

  try {
    const searchedUser = await userModel.getCompany(userId);
    if (!searchedUser) {
      return APIResponse(res, null, "La récupération de l'utilisateur a échoué", 403);
    }

    if (searchedUser.companyId !== userCompanyId) {
      return APIResponse(res, null, "Vous ne pouvez pas accéder aux données de cet utilisateur", 500);
    }

    next();
  } catch (error) {
    return APIResponse(res, null, "Erreur lors de la vérification de l'entreprise", 500);
  }
};