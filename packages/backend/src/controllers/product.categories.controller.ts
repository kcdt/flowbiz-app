import { Request, Response } from 'express';
import { categoryService } from '../services/product.categories.service';
import { createCategorySchema, updateCategorySchema } from '../validation/product.categories.validation';
import { VerifiedAuthRequest } from '../types/auth.types';
import APIResponse from '../utils/response.utils';
import logger from '../utils/logger.utils';

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
      logger.error(`Erreur lors de la récupération des catégories`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
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
      logger.error(`Erreur lors de la récupération de la catégorie`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
    }
  },
  
  async create(req: Request, res: Response) {
    try {
      const authReq = req as VerifiedAuthRequest;
      const companyId = authReq.user.companyId;
      
      const validatedData = createCategorySchema.parse(req.body);
      
      const newCategory = await categoryService.createCategory({
        ...validatedData,
        companyId
      });
      
      return APIResponse(res, newCategory, "Catégorie créée avec succès", 201);
    } catch (error: any) {
      logger.error(`Erreur lors de la création de la catégorie`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
    }
  },
  
  async update(req: Request, res: Response) {
    try {
      const authReq = req as VerifiedAuthRequest;
      const companyId = authReq.user.companyId;
      const { id } = req.params;
      
      const validatedData = updateCategorySchema.parse(req.body);
      
      try {
        const updatedCategory = await categoryService.updateCategory(id, companyId, validatedData);
        return APIResponse(res, updatedCategory, "Catégorie mise à jour avec succès", 200);
      } catch (error: any) {
        if (error.message === 'Catégorie non trouvée') {
          return APIResponse(res, null, "Catégorie non trouvée", 404);
        }
        throw error;
      }
    } catch (error: any) {
      logger.error(`Erreur lors de la mise à jour de la catégorie`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
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
          return APIResponse(res, null, error.message, 409);
        }
        throw error;
      }
    } catch (error: any) {
      logger.error(`Erreur lors de la suppression de la catégorie`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
    }
  }
};