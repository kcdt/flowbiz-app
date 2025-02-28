import { Request, Response } from 'express';
import { saleModel } from '../models/sale.model';
import APIResponse from '../utils/response.utils';
import { VerifiedAuthRequest } from '../types/auth.types';

export const saleController = {
  async createSale(req: Request, res: Response) {
    try {
      const authReq = req as VerifiedAuthRequest;
      const { price, buyerName, buyerAddress, items } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return APIResponse(res, null, "La commande doit contenir au moins un article", 400);
      }
      
      const saleData = {
        price,
        buyerName,
        buyerAddress,
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
      const authReq = req as VerifiedAuthRequest;
      
      const sales = await saleModel.getAll({
        status: status as string,
        startDate: startDate as string,
        endDate: endDate as string,
        companyId: authReq.user.companyId as string
      });
      
      return APIResponse(res, sales, "Commandes récupérées avec succès", 200);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },
  
  async getSaleById(req: Request, res: Response) {
    try {
      const authReq = req as VerifiedAuthRequest;
      const userCompanyId = authReq.user.companyId;
      const { id } = req.params;
      
      const sale = await saleModel.getById(id, userCompanyId);
      if (!sale) {
        return APIResponse(res, null, "Commande non trouvée", 404);
      }

      if (sale.companyId !== authReq.user.companyId) {
        return APIResponse(res, null, "Vous n'êtes pas autorisé à accéder à cette commande", 403);
      }
      
      return APIResponse(res, sale, "Commande récupérée avec succès", 200);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },
  
  async updateSaleStatus(req: Request, res: Response) {
    try {
      const authReq = req as VerifiedAuthRequest;
      const userCompanyId = authReq.user.companyId;
      const { id } = req.params;
      const { status } = req.body;
      
      const updatedSale = await saleModel.updateStatus(id, userCompanyId, status);
      
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