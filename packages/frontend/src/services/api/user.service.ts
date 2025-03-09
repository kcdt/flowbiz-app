import apiService from './api.service';
import type { User } from '@/types/models';

export default {

  getById(id: string) {
    return apiService.get(`/user/${id}`);
  },
  
  update(id: string, userData: Partial<User>) {
    return apiService.patch(`/user/${id}`, userData);
  },
  
  delete(id: string) {
    return apiService.delete(`/user/${id}`);
  },

  updatePassword(id: string, currentPassword: string, newPassword: string) {
    return apiService.patch(`/user/${id}/password`, { 
      currentPassword, 
      newPassword 
    });
  }
};