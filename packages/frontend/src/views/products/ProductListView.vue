<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useProductStore } from '@/stores/product.store';
import ProductListItem from '@/components/products/ProductListItem.vue';
import Icon from '@/components/common/Icon.vue';
import ProductDetailModal from '@/components/layout/modals/ProductDetailModal.vue';
import ProductEditModal from '@/components/layout/modals/ProductEditModal.vue';
import { Product } from '@/types/models';
import { useCategoryStore } from '@/stores/product.category.store';
import ProductCategoriesModal from '@/components/layout/modals/ProductCategoriesModal.vue';

const productStore = useProductStore();
const productCategorystore = useCategoryStore();

const selectedStatusFilter = ref<any>('all');
const searchQuery = ref<any>('');

const filteredSales = computed(() => {
  let result = productStore.products;
  
  if (selectedStatusFilter.value !== 'all') {
    result = result.filter(product => product.categoryId === selectedStatusFilter.value);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(sale => 
      sale.name.toLowerCase().includes(query)
    );
  }
  
  return result;
});

const openEditModal = () => {
  productStore.openProductEdit(productStore.currentProduct?.id || null);
};

const createNewCategory = () => {
  productCategorystore.openProductCategoriesModal();
};

const handleProductSaved = (product: Product) => {
  console.log('Produit sauvegardé:', product);
};

const openNewProductModal = () => {
  productStore.openProductEdit(null);
};

onMounted(async () => {
  try {
    await productStore.fetchProducts();
  } catch (error) {
    console.error("Erreur lors du chargement des produits:", error);
  }
});
</script>

<template>
  <section class="product-list-view">
    <div class="section-title">
      <Icon name="Package"/>
      <h1>Catalogue</h1>
    </div>
    <div v-if="productStore.isLoading">Chargement...</div>
    <div v-else class="list-view-content">
      <h3>Valeur totale du stock : {{ productStore.totalInventoryValue.toFixed(2) }} €</h3>
      <div class="filter-container">
        <div class="search-container">
          <div class="search-group">
            <label for="search-input" class="sr-only">Rechercher</label>
            <div class="search-input-wrapper">
              <input
                id="search-input"
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher par nom de produit"
                class="search-input"
              />
              <button 
                v-if="searchQuery" 
                @click="searchQuery = ''" 
                class="clear-search-btn" 
                aria-label="Effacer la recherche"
              >
                &times;
              </button>
              <span class="search-icon">🔍</span>
            </div>
          </div>
        </div>
        <div class="right-filter-part">
          <div class="filter-group">
            <label for="status-filter">Filtres</label>
            <select 
              id="status-filter" 
              v-model="selectedStatusFilter" 
              class="status-filter"
            >
              <option value="all">Toutes les catégories</option>
              <option 
                v-for="(category, value) in productCategorystore.categories" 
                :key="value" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="actions">
            <button class="btn-secondary" v-on:click="createNewCategory">Gérer les catégories</button>
            <button class="btn-primary" v-on:click="openNewProductModal">Ajouter un produit</button>
          </div>
        </div>
      </div>
      <div class="product-list">
        <template v-for="product in filteredSales" :key="product.id">
          <ProductListItem :product="product" />
        </template>
        <div v-if="filteredSales.length === 0" class="empty-state">
          <p>Aucune vente ne correspond à votre recherche</p>
        </div>
      </div>
      <ProductDetailModal 
        :is-open="productStore.isDetailModalOpen"
        @edit="openEditModal"
        @close="productStore.closeProductDetail"
      />
      <ProductEditModal
        :is-open="productStore.isEditModalOpen"
        @save="handleProductSaved"
        @close="productStore.closeProductEdit"
      />
      <ProductCategoriesModal 
        :is-open="productCategorystore.isModalOpen" 
      />
    </div>
  </section>
</template>