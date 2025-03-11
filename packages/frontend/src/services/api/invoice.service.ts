import apiService from './api.service';
import type { Invoice } from '@/types/models';

export default {
  getAll(params = {}) {
    return apiService.get('/invoices', params);
  },
  
  getById(id: string) {
    return apiService.get(`/invoices/${id}`);
  },
  
  createFromSale(saleId: string) {
    return apiService.post('/invoices', { saleId });
  },
  
  updateStatus(id: string, status: string) {
    return apiService.patch(`/invoices/${id}/status`, { status });
  },
  
  getPdf(id: string) {
    return apiService.get(`/invoices/${id}/pdf`, {
      responseType: 'blob',
    });
  },
};