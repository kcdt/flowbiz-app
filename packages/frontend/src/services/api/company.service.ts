import apiClient from '@/config/axios';

export default {
  getById(id: string) {
    return apiClient.get(`/company/${id}`);
  }
};