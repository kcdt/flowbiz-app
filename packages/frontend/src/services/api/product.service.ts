import apiClient from '@/config/axios';
import type { ProductCreateInput, ProductUpdateInput } from '@/types/models';

export default {
  getAll(params = {}) {
    return apiClient.get('/products', { params });
  },
  
  getById(id: string) {
    return apiClient.get(`/products/${id}`);
  },
  
  create(product: ProductCreateInput) {
    return apiClient.post('/products', product);
  },
  
  update(id: string, product: ProductUpdateInput) {
    return apiClient.put(`/products/${id}`, product);
  },
  
  delete(id: string) {
    return apiClient.delete(`/products/${id}`);
  }
};