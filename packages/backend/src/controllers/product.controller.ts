import { Request, Response } from 'express';
import { productModel } from '../models/product.model';
import { VerifiedAuthRequest } from '../types/auth.types';
import APIResponse from '../utils/response.utils';
import { logger } from '../utils/logger.utils';

export const productController = {
  async getAll(req: Request, res: Response) {
    try {
      const authReq = req as VerifiedAuthRequest;
      const userCompanyId = authReq.user.companyId;

      const allProduct = await productModel.getAll(userCompanyId);
      return APIResponse(res, allProduct, "Produits récupérés", 200);
    } catch (error: any) {
      logger.error(`Erreur lors de la récupération des produits`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
    }
  },

  async create(req: Request, res: Response) {
    try {
      const authReq = req as VerifiedAuthRequest;
      const userCompanyId = authReq.user.companyId;

      const { name, description, quantity, imageUrl, price, status, categoryId } = req.body;
      const newProduct = { name, description, quantity, imageUrl, price, status, companyId: userCompanyId, categoryId };
      if (!quantity) {
        newProduct.quantity = 1;
      }

      const createdProduct = await productModel.create(newProduct);
      return APIResponse(res, { id: createdProduct[0].id, ...newProduct }, "Produit créé", 201);
    } catch (error: any) {
      logger.error(`Erreur lors de la création du produit`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
    
      const product = await productModel.getById(id);
      if (!product) {
        throw new Error("Aucun produit trouvé");
      } else {
        return APIResponse(res, product, "Produit récupéré", 200);
      }
    } catch (error: any) {
      logger.error(`Erreur lors de la récupération du produit`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
    }
  },

  async update (req: Request, res: Response) {
    try {
      const { id } = req.params;
      await productModel.existingProduct(id);
      const updatedProduct = await productModel.updateById(id, req.body);
      return APIResponse(res, updatedProduct, "Produit mis à jour", 200);
    } catch (error: any) {
      logger.error(`Erreur lors de la mise à jour du produit`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
    }
  },

  async delete (req: Request, res: Response) {
    try {
      const { id } = req.params;

      const isUsed = await productModel.isProductUsedInSales(id);

      if (isUsed) {
        return APIResponse(res, null, "Impossible de supprimer ce produit car il est utilisé dans une ou plusieurs ventes", 500);
      }

      await productModel.existingProduct(id);
      const deletedProduct = await productModel.deleteById(id);
      return APIResponse(res, deletedProduct, "Produit supprimé", 200);
    } catch (error: any) {
      logger.error(`Erreur lors de la suppression du produit`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
    }
  },
};