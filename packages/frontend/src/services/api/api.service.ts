import apiClient from '@/config/axios';

export default {
  get(resource: string, params = {}) {
    return apiClient.get(resource, { params });
  },
  
  post(resource: string, data?: any) {
    return apiClient.post(resource, data);
  },

  put(resource: string, data?: any) {
    return apiClient.put(resource, data);
  },
  
  patch(resource: string, data?: any) {
    return apiClient.patch(resource, data);
  },
  
  delete(resource: string) {
    return apiClient.delete(resource);
  },
  
  // Pour les requêtes avec des fichiers (multipart/form-data)
  upload(resource: string, formData: FormData) {
    return apiClient.post(resource, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};