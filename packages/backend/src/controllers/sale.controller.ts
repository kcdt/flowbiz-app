import { Request, Response } from 'express';
import { saleModel } from '../models/sale.model';
import APIResponse from '../utils/response.utils';
import { AuthRequest } from '../types/auth.types';

export const saleController = {
  async createSale(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const { price, buyerName, buyerAddress, items } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return APIResponse(res, null, "La commande doit contenir au moins un article", 400);
      }

      if (!authReq.user?.id || !authReq.user?.companyId) {
        return APIResponse(res, null, "Utilisateur non authentifié", 401);
      }
      
      const saleData = {
        price,
        buyerName,
        buyerAddress,
        userId: authReq.user.id,
        companyId: authReq.user.companyId
      };
      
      const newSale = await saleModel.create(saleData, items);
      
      return APIResponse(res, newSale, "Commande créée avec succès", 201);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },
  
  async getSales(req: Request, res: Response) {
    try {
      const { status, startDate, endDate } = req.query;
      const authReq = req as AuthRequest;

      if (!authReq.user?.id || !authReq.user?.companyId) {
        return APIResponse(res, null, "Utilisateur non authentifié", 401);
      }
      
      const sales = await saleModel.getAll({
        status: status as string,
        startDate: startDate as string,
        endDate: endDate as string,
        userId: authReq.user?.id as string,
        companyId: authReq.user.companyId as string
      });
      
      return APIResponse(res, sales, "Commandes récupérées avec succès", 200);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },
  
  async getSaleById(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const { id } = req.params;
      
      const sale = await saleModel.getById(id);
      if (!sale) {
        return APIResponse(res, null, "Commande non trouvée", 404);
      }

      if (sale.userId !== authReq.user?.id || sale.companyId !== authReq.user?.companyId) {
        return APIResponse(res, null, "Vous n'êtes pas autorisé à accéder à cette commande", 403);
      }
      
      return APIResponse(res, sale, "Commande récupérée avec succès", 200);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },
  
  async updateSaleStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const updatedSale = await saleModel.updateStatus(id, status);
      
      return APIResponse(res, updatedSale, "Statut de la commande mis à jour", 200);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },
  
  async deleteSale(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await saleModel.delete(id);
      
      return APIResponse(res, null, "Commande supprimée avec succès", 200);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  }
};