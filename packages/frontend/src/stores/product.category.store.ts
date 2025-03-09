import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import categoryService from '@/services/api/product.categories.service';
import type { Category, CategoryCreateInput, CategoryUpdateInput } from '@/types/models';

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isModalOpen = ref<boolean>(false);
  
  async function fetchCategories() {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await categoryService.getAll();
      categories.value = response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des catégories';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function createCategory(category: CategoryCreateInput) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await categoryService.create(category);
      const newCategory = response.data.data;
      categories.value.push(newCategory);
      return newCategory;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la création de la catégorie';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function updateCategory(id: string, category: CategoryUpdateInput) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await categoryService.update(id, category);
      const updatedCategory = response.data.data;
      
      const index = categories.value.findIndex((c: any) => c.id === id);
      if (index !== -1) {
        categories.value[index] = { ...categories.value[index], ...updatedCategory };
      }
      
      return updatedCategory;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour de la catégorie';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function deleteCategory(id: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      await categoryService.delete(id);
      categories.value = categories.value.filter((c: any) => c.id !== id);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression de la catégorie';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  const openProductCategoriesModal = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      await fetchCategories();
      isModalOpen.value = true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement du produit';
    } finally {
      isLoading.value = false;
    }
  };
  
  const closeProductCategoriesModal = () => {
    isModalOpen.value = false;
  };
  
  return {
    categories,
    isLoading,
    error,
    isModalOpen,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    openProductCategoriesModal,
    closeProductCategoriesModal
  };
});