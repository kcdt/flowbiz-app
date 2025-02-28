import { Request, Response, NextFunction } from 'express';
import { VerifiedAuthRequest } from '../types/auth.types';
import APIResponse from '../utils/response.utils';
import { productModel } from '../models/product.model';
import { saleModel } from '../models/sale.model';

export const checkProductOwner = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as VerifiedAuthRequest;
  const userCompanyId = authReq.user.companyId;
  const productId = req.params.id;
  
  if (!productId) {
    return APIResponse(res, null, "ID de produit non fourni", 400);
  }

  try {
    const product = await productModel.verifyProductOwner(productId, userCompanyId);
    if (!product) {
      return APIResponse(res, null, "Vous n'êtes pas autorisé à accéder à ce produit", 403);
    }

    next();
  } catch (error) {
    return APIResponse(res, null, "Erreur lors de la vérification du produit", 500);
  }
};

export const checkSaleOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as VerifiedAuthRequest;
    const userCompanyId = authReq.user.companyId;
    const sale = await saleModel.verifySaleOwner(req.params.id, userCompanyId);
    if (!sale) {
      return APIResponse(res, null, "Impossible de récupérer la commande, id incorrect", 400);
    }

    if (userCompanyId === sale.companyId) {
      return next();
    }

    return APIResponse(res, null, "Vous n'êtes pas autorisé à accéder à cette vente", 403);
  } catch (error) {
  
    return APIResponse(res, error, "Erreur lors de la vérification de la vente", 500);
  }
};