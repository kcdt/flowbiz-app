import { categoryModel } from '../models/product.categories.model';
import { CreateCategoryInput, UpdateCategoryInput } from '../validation/product.categories.validation';

export const categoryService = {
  async getAllCategories(companyId: string) {
    try {
      return await categoryModel.findMany(companyId);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Impossible de récupérer les catégories');
    }
  },

  async getAllCategoriesWithProducts(companyId: string) {
    try {
      return await categoryModel.findManyWithProducts(companyId);
    } catch (error) {
      console.error('Error fetching categories with products:', error);
      throw new Error('Impossible de récupérer les catégories avec les produits');
    }
  },

  async getCategoryById(id: string, companyId: string) {
    try {
      const category = await categoryModel.findByIdAndCompany(id, companyId);
      
      if (!category) {
        throw new Error('Catégorie non trouvée');
      }
      
      return category;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  async getCategoryWithProducts(id: string, companyId: string) {
    try {
      const category = await categoryModel.findByIdWithProducts(id, companyId);
      
      if (!category) {
        throw new Error('Catégorie non trouvée');
      }
      
      return category;
    } catch (error) {
      console.error(`Error fetching category ${id} with products:`, error);
      throw error;
    }
  },

  async createCategory(data: CreateCategoryInput & { companyId: string }) {
    try {
      return await categoryModel.insert(data);
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Impossible de créer la catégorie');
    }
  },

  async updateCategory(id: string, companyId: string, data: UpdateCategoryInput) {
    try {
      const existingCategory = await categoryModel.findByIdAndCompany(id, companyId);
      
      if (!existingCategory) {
        throw new Error('Catégorie non trouvée');
      }
      
      return await categoryModel.update(id, companyId, data);
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  async deleteCategory(id: string, companyId: string) {
    try {
      const existingCategory = await categoryModel.findByIdAndCompany(id, companyId);
      
      if (!existingCategory) {
        throw new Error('Catégorie non trouvée');
      }
      
      const productCount = await categoryModel.countProductsByCategory(id);
      
      if (productCount > 0) {
        throw new Error('Impossible de supprimer une catégorie contenant des produits');
      }
      
      await categoryModel.delete(id, companyId);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  }
};