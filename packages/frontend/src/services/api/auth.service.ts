import apiClient from '@/config/axios';

export default {
  login(email: string, password: string) {
    return apiClient.post('/auth/login', { email, password });
  },
  
  register(formData: {
    userName: string,
    userEmail: string,
    userPhone: string,
    password: string,
    role?: 'standard_seller',
    companyName: string,
    companyAddress: string,
    companyPhone: string,
    companyEmail: string,
    taxId?: string }) {
    return apiClient.post('/auth/register', formData);
  },
  
  logout() {
    return apiClient.post('/auth/logout');
  },
  
  refreshToken() {
    return apiClient.post('/auth/refresh-token');
  },
  
  getCurrentUser() {
    return apiClient.get('/auth/me');
  }
};