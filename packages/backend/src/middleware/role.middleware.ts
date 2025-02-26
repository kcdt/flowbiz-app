import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth.types';
import APIResponse from '../utils/response.utils';

export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      return APIResponse(res, null, "Accès non autorisé", 401);
    }
    
    if (allowedRoles.includes(authReq.user.role)) {
      next();
    } else {
      return APIResponse(res, null, "Vous n'avez pas les permissions nécessaires", 403);
    }
  };
};

export const adminSellerOnly = checkRole(['admin_seller']);

export const sellerOnly = checkRole(['admin_seller', 'standard_seller']);

export const supplierOnly = checkRole(['supplier']);