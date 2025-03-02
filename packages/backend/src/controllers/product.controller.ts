import { Request, Response } from 'express';
import { productModel } from '../models/product.model';
import { VerifiedAuthRequest } from '../types/auth.types';
import APIResponse from '../utils/response.utils';

export const productController = {
  async getAll(req: Request, res: Response) {
    try {
      const authReq = req as VerifiedAuthRequest;
      const userCompanyId = authReq.user.companyId;

      const allProduct = await productModel.getAll(userCompanyId);
      return APIResponse(res, allProduct, "Produits récupérés", 200);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },

  async create(req: Request, res: Response) {
    try {
      const authReq = req as VerifiedAuthRequest;
      const userCompanyId = authReq.user.companyId;

      const { name, description, quantity, imageUrl, price, status } = req.body;
      const newProduct = { name, description, quantity, imageUrl, price, status, companyId: userCompanyId };
      if (!quantity) {
        newProduct.quantity = 1;
      }

      const createdProduct = await productModel.create(newProduct);
      return APIResponse(res, { id: createdProduct[0].id, ...newProduct }, "Produit créé", 201);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 400);
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
      return APIResponse(res, null, error.message, 404);
    }
  },

  async update (req: Request, res: Response) {
    try {
      const { id } = req.params;

      await productModel.existingProduct(id);
      const updatedProduct = await productModel.updateById(id, req.body);
      return APIResponse(res, updatedProduct, "Produit mis à jour");
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },

  async delete (req: Request, res: Response) {
    try {
      const { id } = req.params;

      const isUsed = await productModel.isProductUsedInSales(id);

      if (isUsed) {
        return APIResponse(res, null, "Impossible de supprimer ce produit car il est utilisé dans une ou plusieurs ventes");
      }

      await productModel.existingProduct(id);
      const deletedProduct = await productModel.deleteById(id);
      return APIResponse(res, deletedProduct, "Produit supprimer");
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },
};