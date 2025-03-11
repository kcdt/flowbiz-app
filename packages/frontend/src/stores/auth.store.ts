import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import authService from '@/services/api/auth.service';
import router from '@/router';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const accessToken = ref<string | null>(null);
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

  async function register(formData: {
    userName: string,
    userEmail: string,
    userPhone: string,
    password: string,
    role?: 'admin_seller',
    companyName: string,
    companyAddress: string,
    companyPhone: string,
    companyEmail: string,
    taxId?: string }) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authService.register(formData);
      router.push({ name: 'login' });
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur d\'inscription';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function login(email: string, password: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await authService.login(email, password);
      accessToken.value = response.data.data.accessToken;
      user.value = response.data.data.user;
      
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
      
      if (response && response.data && response.data.data && response.data.data.accessToken) {
        accessToken.value = response.data.data.accessToken;
        return response.data;
      } else {
        console.error('[Auth] Format de réponse refresh incorrect :', response);
        throw new Error('Format de réponse incorrect');
      }
    } catch (err: any) {
      console.error('[Auth] Erreur refresh token :', err);
      console.error('[Auth] Status :', err.response?.status);
      console.error('[Auth] Message :', err.response?.data?.message);
      throw err;
    }
  }
  
  function logout() {
    user.value = null;
    accessToken.value = null;
    
    authService.logout()
      .then(() => {
        router.push({ name: 'login' });
      })
      .catch((err) => {
        console.error("Erreur lors de la déconnexion", err);
        router.push({ name: 'login' });
      });
  }
  
  async function checkAuth() {
    try {
      await refreshToken();
      
      if (accessToken.value && !user.value) {
        const response = await authService.getCurrentUser();
        user.value = response.data.data;
      }
      
      return true;
    } catch (err) {
      if (accessToken.value) {
        if (isTokenValid.value) {
          if (!user.value) {
            try {
              const response = await authService.getCurrentUser();
              user.value = response.data.data;
              return true;
            } catch (userErr) {
              console.error("Erreur lors de la récupération des données utilisateur:", userErr);
              logout();
            }
          } else {
            return true;
          }
        } else {
          logout();
        }
      }
    }
    
    return false;
  }
  
  function resetState() {
    user.value = null;
    accessToken.value = null;
    error.value = null;
    isLoading.value = false;
  }
  
  return {
    user,
    accessToken,
    isLoading,
    error,
    isAuthenticated,
    isTokenValid,
    register,
    login,
    refreshToken,
    logout,
    checkAuth,
    resetState
  };
});