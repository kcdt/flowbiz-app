import { Request, Response } from 'express';
import { categoryService } from '../services/product.categories.service';
import { createCategorySchema, updateCategorySchema } from '../validation/product.categories.validation';
import { VerifiedAuthRequest } from '../types/auth.types';
import APIResponse from '../utils/response.utils';

export const categoryController = {
  async getAll(req: Request, res: Response) {
    try {
      const authReq = req as VerifiedAuthRequest;
      const companyId = authReq.user.companyId;
      
      const withProducts = req.query.withProducts === 'true';
      let categories;
      
      if (withProducts) {
        categories = await categoryService.getAllCategoriesWithProducts(companyId);
      } else {
        categories = await categoryService.getAllCategories(companyId);
      }
      
      return APIResponse(res, categories, "Catégories récupérées avec succès", 200);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },
  
  async getById(req: Request, res: Response) {
    try {
      const authReq = req as VerifiedAuthRequest;
      const companyId = authReq.user.companyId;
      const { id } = req.params;
      
      const withProducts = req.query.withProducts === 'true';
      let category;
      
      try {
        if (withProducts) {
          category = await categoryService.getCategoryWithProducts(id, companyId);
        } else {
          category = await categoryService.getCategoryById(id, companyId);
        }
      } catch (error: any) {
        if (error.message === 'Catégorie non trouvée') {
          return APIResponse(res, null, "Catégorie non trouvée", 404);
        }
        throw error;
      }
      
      return APIResponse(res, category, "Catégorie récupérée avec succès", 200);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },
  
  async create(req: Request, res: Response) {
    try {
      const authReq = req as VerifiedAuthRequest;
      const companyId = authReq.user.companyId;
      
      // Valider les données
      const validatedData = createCategorySchema.parse(req.body);
      
      // Créer la catégorie
      const newCategory = await categoryService.createCategory({
        ...validatedData,
        companyId
      });
      
      return APIResponse(res, newCategory, "Catégorie créée avec succès", 201);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },
  
  async update(req: Request, res: Response) {
    try {
      const authReq = req as VerifiedAuthRequest;
      const companyId = authReq.user.companyId;
      const { id } = req.params;
      
      // Valider les données
      const validatedData = updateCategorySchema.parse(req.body);
      
      try {
        // Mettre à jour la catégorie
        const updatedCategory = await categoryService.updateCategory(id, companyId, validatedData);
        return APIResponse(res, updatedCategory, "Catégorie mise à jour avec succès", 200);
      } catch (error: any) {
        if (error.message === 'Catégorie non trouvée') {
          return APIResponse(res, null, "Catégorie non trouvée", 404);
        }
        throw error;
      }
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },
  
  async delete(req: Request, res: Response) {
    try {
      const authReq = req as VerifiedAuthRequest;
      const companyId = authReq.user.companyId;
      const { id } = req.params;
      
      try {
        await categoryService.deleteCategory(id, companyId);
        return APIResponse(res, null, "Catégorie supprimée avec succès", 200);
      } catch (error: any) {
        if (error.message === 'Catégorie non trouvée') {
          return APIResponse(res, null, "Catégorie non trouvée", 404);
        } else if (error.message === 'Impossible de supprimer une catégorie contenant des produits') {
          return APIResponse(res, null, error.message, 400);
        }
        throw error;
      }
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  }
};