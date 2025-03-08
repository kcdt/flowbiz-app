import apiClient from '@/config/axios';
import type { Category, CategoryCreateInput, CategoryUpdateInput } from '@/types/models';

export default {
  getAll() {
    return apiClient.get('/product-categories');
  },
  
  getById(id: string) {
    return apiClient.get(`/product-categories/${id}`);
  },
  
  create(category: CategoryCreateInput) {
    return apiClient.post('/product-categories', category);
  },
  
  update(id: string, category: CategoryUpdateInput) {
    return apiClient.put(`/product-categories/${id}`, category);
  },
  
  delete(id: string) {
    return apiClient.delete(`/product-categories/${id}`);
  }
};