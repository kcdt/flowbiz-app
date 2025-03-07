import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import authService from '@/services/api/auth.service';
import router from '@/router';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const accessToken = ref(localStorage.getItem('accessToken') || null);
  const isLoading = ref(false);
  const error = ref(null);
  
  const isAuthenticated = computed(() => !!accessToken.value);
  
  const isTokenValid = computed(() => {
    if (!accessToken.value) return false;
    
    try {
      const decodedToken = jwtDecode(accessToken.value as string);

      const currentTime = Date.now() / 1000;
      
      return decodedToken.exp && decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  });
  
  async function login(email: string, password: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await authService.login(email, password);
      accessToken.value = response.data.data.accessToken;
      user.value = response.data.data.user;
      
      localStorage.setItem('accessToken', accessToken.value as string);
      
      router.push({ name: 'dashboard' });
      return response.data;
    } catch (err) {
      error.value = (err as any).response?.data?.message || 'Erreur de connexion';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function refreshToken() {
    try {
      const response = await authService.refreshToken();
      accessToken.value = response.data.data.accessToken;
      
      localStorage.setItem('accessToken', accessToken.value as string);
      
      return response.data;
    } catch (err) {
      logout();
      throw err;
    }
  }
  
  function logout() {
    user.value = null;
    accessToken.value = null;
    localStorage.removeItem('accessToken');
    
    authService.logout().catch(() => {
      throw error
    });
    
    router.push({ name: 'login' });
  }
  
  async function checkAuth() {
    if (accessToken.value && !isTokenValid.value) {
      try {
        await refreshToken();
      } catch (err) {
        logout();
        throw err;
      }
    } else if (accessToken.value && !user.value) {
      try {
        const response = await authService.getCurrentUser();
        user.value = response.data.data;
      } catch (err) {
        logout();
      }
    }
  }
  
  return {
    user,
    accessToken,
    isLoading,
    error,
    isAuthenticated,
    isTokenValid,
    login,
    refreshToken,
    logout,
    checkAuth
  };
});