import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import authService from '@/services/api/auth.service';
import router from '@/router';

interface User {
  id: string;
  email: string;
  role: string;
  companyId?: string;
}

export const useAuthStore = defineStore('auth', () => {
  // state
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // computed
  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin_seller');
  
  // actions
  async function login(email: string, password: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await authService.login(email, password);
      accessToken.value = response.data.data.accessToken;
      user.value = response.data.data.user;
      
      router.push({ name: 'dashboard' });
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur de connexion';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function register(formData: {
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
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await authService.register(formData);
      
      // Après inscription réussie, rediriger vers connexion
      router.push({ name: 'login' });
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur d\'inscription';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function refreshToken() {
    try {
      const response = await authService.refreshToken();
      accessToken.value = response.data.data.accessToken;
      return response.data;
    } catch (err) {
      logout();
      throw err;
    }
  }
  
  function logout() {
    user.value = null;
    accessToken.value = null;
    error.value = null;
    
    authService.logout()
      .then(() => {
        router.push({ name: 'login' });
      })
      .catch((err) => {
        console.error('Erreur lors de la déconnexion:', err);
        router.push({ name: 'login' });
      });
  }
  
  return {
    user,
    accessToken,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    refreshToken,
    logout
  };
});