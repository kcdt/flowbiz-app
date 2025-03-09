import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import userService from '@/services/api/user.service';
import type { User } from '@/types/models';
import authService from '@/services/api/auth.service';
import companyService from '@/services/api/company.service';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null);
  const currentUserCompany = ref<any | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  const isAuthenticated = computed(() => !!currentUser.value);
  
  const isAdmin = computed(() => {
    return currentUser.value?.role === 'admin';
  });
  
  const userProfile = computed(() => {
    return currentUser.value;
  });
  
  async function fetchCurrentUser() {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await authService.getCurrentUser();
      currentUser.value = response.data.data;
      return currentUser.value;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erreur lors du chargement de l'utilisateur";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

    
  async function fetchUserCompany() {
    isLoading.value = true;
    error.value = null;
    
    try {
      if (!currentUser.value?.companyId) {
        throw new Error("Company ID is undefined");
      }
      const response = await companyService.getById(currentUser.value.companyId);
      currentUserCompany.value = response.data.data;
      return currentUserCompany.value;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erreur lors du chargement de l'utilisateur";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function fetchUserById(id: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await userService.getById(id);
      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erreur lors du chargement de l'utilisateur";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function updateUser(id: string, userData: Partial<User>) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await userService.update(id, userData);
      
      // Si on met à jour l'utilisateur actuel, mettre à jour le state aussi
      if (currentUser.value && currentUser.value.id === id) {
        currentUser.value = { ...currentUser.value, ...response.data.data };
      }
      
      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erreur lors de la mise à jour de l'utilisateur";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function updatePassword(id: string, currentPassword: string, newPassword: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await userService.updatePassword(id, currentPassword, newPassword);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erreur lors de la mise à jour du mot de passe";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function deleteUser(id: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      await userService.delete(id);
      
      // Si c'est l'utilisateur actuel, effacer les données
      if (currentUser.value && currentUser.value.id === id) {
        currentUser.value = null;
      }
      
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erreur lors de la suppression de l'utilisateur";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  
  function logout() {
    currentUser.value = null;
  }
  
  function resetState() {
    currentUser.value = null;
    error.value = null;
    isLoading.value = false;
  }
  
  return {
    // State
    currentUser,
    isLoading,
    error,
    currentUserCompany,
    
    // Getters
    isAuthenticated,
    isAdmin,
    userProfile,
    
    // Actions
    fetchCurrentUser,
    fetchUserCompany,
    fetchUserById,
    updateUser,
    updatePassword,
    deleteUser,
    logout,
    resetState
  };
});