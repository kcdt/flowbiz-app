import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import salesService from '@/services/api/sales.service';
import { detailedSale, Sale, SaleCreateInput, SaleUpdateInput } from '@/types/models';

export const useSalesStore = defineStore('sale', () => {
  const sales = ref<Sale[]>([]);
  const currentSale = ref<detailedSale | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isDetailModalOpen = ref(false);
  const isEditModalOpen = ref(false);
  
  const getSaleById = computed(() => {
    return (id: string) => sales.value.find(sale => sale.id === id);
  });

  const getSalesByStatus = computed(() => {
    return (status: string | null) => {
      if (!status) return sales.value;
      return sales.value.filter(sale => sale.status === status);
    };
  });

  const fetchSales = async() => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await salesService.getAll();
      sales.value = response.data.data;
      return sales.value;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des produits';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  const fetchSaleById = async(id: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await salesService.getById(id);
      currentSale.value = response.data.data;
      return currentSale.value;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement du produit';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  const createSale = async (saleData: SaleCreateInput) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await salesService.create(saleData);
      const newSale = response.data.data;
      sales.value.push(newSale);
      return newSale;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la création de la vente';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  const updateSale = async(id: string, saleData: SaleUpdateInput) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await salesService.update(id, saleData);
      const updatedSale = response.data.data;
      
      const index = sales.value.findIndex(p => p.id === id);
      if (index !== -1) {
        sales.value[index] = { ...sales.value[index], ...updatedSale };
      }
      
      if (currentSale.value && currentSale.value.id === id) {
        currentSale.value = { ...currentSale.value, ...updatedSale };
      }
      
      return updatedSale;
    } catch (err: any) {
      closeSaleEdit();
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour du produit';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  const deleteSale = async(id: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      await salesService.delete(id);
      
      sales.value = sales.value.filter(p => p.id !== id);
      
      if (currentSale.value && currentSale.value.id === id) {
        currentSale.value = null;
      }
      
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression du produit';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  const resetState = () => {
    sales.value = [];
    currentSale.value = null;
    error.value = null;
    isLoading.value = false;
  };

  const openSaleDetail = async (saleId: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      await fetchSaleById(saleId);
      isDetailModalOpen.value = true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement du produit';
    } finally {
      isLoading.value = false;
    }
  };
  
  const closeSaleDetail = () => {
    isDetailModalOpen.value = false;
  };

  const openSaleEdit = async (saleId: string | null) => {
    isLoading.value = true;
    error.value = null;

    if (isDetailModalOpen) {
      isDetailModalOpen.value = false;
    }
    
    try {
      if (saleId) {
        currentSale.value = await fetchSaleById(saleId);
      } else {
        currentSale.value = null;
      }
      isEditModalOpen.value = true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement du produit';
    } finally {
      isLoading.value = false;
    }
  };

  const closeSaleEdit = () => {
    isEditModalOpen.value = false;
  };

  const SaleStatus = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
  };
  
  const statusLabels = {
    [SaleStatus.PENDING]: 'Émise',
    [SaleStatus.COMPLETED]: 'Finalisée',
    [SaleStatus.CANCELLED]: 'Annulée',
    [SaleStatus.REFUNDED]: 'Remboursée'
  };

  return {
    sales,
    currentSale,
    isLoading,
    error,
    isDetailModalOpen,
    isEditModalOpen,
    
    getSaleById,
    getSalesByStatus,
    
    fetchSales,
    fetchSaleById,
    createSale,
    updateSale,
    deleteSale,
    
    resetState,
    openSaleDetail,
    closeSaleDetail,
    openSaleEdit,
    closeSaleEdit,
    statusLabels,
    SaleStatus
  };
});