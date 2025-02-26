import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth.types';
import APIResponse from '../utils/response.utils';
import { productModel } from '../models/product.model';
import { userModel } from '../models/user.model';
import { saleModel } from '../models/sale.model';

export const checkProductOwner = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  const productId = req.params.id;
  const userId = authReq.user?.id;
  
  if (!productId) {
    return APIResponse(res, null, "ID de produit non fourni", 400);
  }
  
  if (!userId) {
    return APIResponse(res, null, "ID utilisateur non fourni", 400);
  }

  try {
    const product = await productModel.getById(productId);
    if (!product) {
      return APIResponse(res, null, "Produit non trouvé", 404);
    }

    if (userId === product.userId) {
      return next();
    }

    const productCompanyId = await userModel.getCompanyId(product.userId);
    const userCompanyId = await userModel.getCompanyId(userId);

    if (productCompanyId && userCompanyId && productCompanyId === userCompanyId) {
      return next();
    }

    return APIResponse(res, null, "Vous n'êtes pas autorisé à accéder à ce produit", 403);
  } catch (error) {
    return APIResponse(res, null, "Erreur lors de la vérification du produit", 500);
  }
};

export const checkSaleOwner = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user?.id;
  
  if (!userId) {
    return APIResponse(res, null, "ID utilisateur non fourni", 400);
  }

  try {
    const sale = await saleModel.getById(req.params.id);
    if (!sale) {
      return APIResponse(res, null, "Impossible de récupérer la commande, id incorrect", 400);
    }

    if (userId === sale.userId) {
      return next();
    }

    const userCompanyId = await userModel.getCompanyId(userId);

    if (sale.companyId && userCompanyId && sale.companyId === userCompanyId) {
      return next();
    }

    return APIResponse(res, null, "Vous n'êtes pas autorisé à accéder à ce produit", 403);
  } catch (error) {
    return APIResponse(res, null, "Erreur lors de la vérification du produit", 500);
  }
};