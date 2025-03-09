import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import productService from '@/services/api/product.service';
import type { Product, ProductCreateInput, ProductUpdateInput } from '@/types/models';

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([]);
  const currentProduct = ref<Product | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const statistics = ref({
    totalInventoryValue: 0,
    totalProductCount: 0,
    lowStockCount: 0
  });
  const isDetailModalOpen = ref(false);
  const isEditModalOpen = ref(false);
  
  const getProductById = computed(() => {
    return (id: string) => products.value.find(product => product.id === id);
  });

  const getProductsByCategory = computed(() => {
    return (categoryId: string | null) => {
      if (!categoryId) return products.value;
      return products.value.filter(product => product.categoryId === categoryId);
    };
  });

  const getLowStockProducts = computed(() => {
    return products.value.filter(product => product.quantity < 5);
  });

  const getOutOfStockProducts = computed(() => {
    return products.value.filter(product => product.quantity <= 0);
  });

  async function fetchProducts() {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await productService.getAll();
      products.value = response.data.data;
      return products.value;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des produits';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchProductById(id: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await productService.getById(id);
      currentProduct.value = response.data.data;
      return currentProduct.value;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement du produit';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function createProduct(productData: ProductCreateInput) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await productService.create(productData);
      const newProduct = response.data.data;
      products.value.push(newProduct);
      return newProduct;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la création du produit';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  const updateProduct = async(id: string, productData: ProductUpdateInput) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await productService.update(id, productData);
      const updatedProduct = response.data.data;
      
      const index = products.value.findIndex(p => p.id === id);
      if (index !== -1) {
        products.value[index] = { ...products.value[index], ...updatedProduct };
      }
      
      if (currentProduct.value && currentProduct.value.id === id) {
        currentProduct.value = { ...currentProduct.value, ...updatedProduct };
      }
      
      return updatedProduct;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour du produit';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  const deleteProduct = async(id: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      await productService.delete(id);
      
      products.value = products.value.filter(p => p.id !== id);
      
      if (currentProduct.value && currentProduct.value.id === id) {
        currentProduct.value = null;
      }
      
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression du produit';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  const totalInventoryValue = computed(() => {
    return products.value.reduce((total, product) => {
      return total + (parseFloat(product.price) * product.quantity);
    }, 0);
  });

  const searchProducts = (query: string) => {
    if (!query.trim()) return products.value;
    
    const searchLower = query.toLowerCase();
    return products.value.filter(product => 
      product.name.toLowerCase().includes(searchLower) || 
      product.description?.toLowerCase().includes(searchLower)
    );
  };

  const filterProductsByPriceRange = (min: number, max: number) => {
    return products.value.filter(product => {
      const price = parseFloat(product.price);
      return price >= min && price <= max;
    });
  };

  const resetState = () => {
    products.value = [];
    currentProduct.value = null;
    error.value = null;
    isLoading.value = false;
  };

  const openProductDetail = async (productId: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      await fetchProductById(productId);
      isDetailModalOpen.value = true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement du produit';
    } finally {
      isLoading.value = false;
    }
  };
  
  const closeProductDetail = () => {
    isDetailModalOpen.value = false;
  };

  const openProductEdit = async (productId: string | null) => {
    isLoading.value = true;
    error.value = null;

    if (isDetailModalOpen) {
      isDetailModalOpen.value = false;
    }
    
    try {
      if (productId) {
        currentProduct.value = await fetchProductById(productId);
      } else {
        currentProduct.value = null;
      }
      isEditModalOpen.value = true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement du produit';
    } finally {
      isLoading.value = false;
    }
  };

  const closeProductEdit = () => {
    isEditModalOpen.value = false;
  };

  return {
    // State
    products,
    currentProduct,
    isLoading,
    error,
    statistics,
    isDetailModalOpen,
    isEditModalOpen,
    
    // Getters
    getProductById,
    getProductsByCategory,
    getLowStockProducts,
    getOutOfStockProducts,
    totalInventoryValue,
    
    // Actions
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    // updateProductStock,
    // fetchStatistics,
    
    // Utilitaires
    searchProducts,
    filterProductsByPriceRange,
    resetState,
    openProductDetail,
    closeProductDetail,
    openProductEdit,
    closeProductEdit
  };
});