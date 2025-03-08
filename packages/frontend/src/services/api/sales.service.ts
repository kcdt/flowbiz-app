import apiService from './api.service';
import type { Sale, SaleCreateInput, SaleUpdateInput } from '@/types/models';

export default {
  getAll(params = {}) {
    return apiService.get('/sales', params);
  },
  
  getById(id: string) {
    return apiService.get(`/sales/${id}`);
  },
  
  create(sale: SaleCreateInput) {
    return apiService.post('/sales', sale);
  },
  
  update(id: string, sale: SaleUpdateInput) {
    return apiService.patch(`/sales/${id}`, sale);
  },
  
  updateStatus(id: string, status: string) {
    return apiService.patch(`/sales/${id}/status`, { status });
  },
  
  delete(id: string) {
    return apiService.delete(`/sales/${id}`);
  },
};