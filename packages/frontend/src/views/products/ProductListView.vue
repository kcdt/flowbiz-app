<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useProductStore } from '@/stores/product.store';
import ProductListItem from '@/components/products/ProductListItem.vue';
import Icon from '@/components/common/Icon.vue';
import ProductDetailModal from '@/components/layout/Modal/ProductDetailModal.vue';
import ProductEditModal from '@/components/layout/Modal/ProductEditModal.vue';
import { Product } from '@/types/models';
import { useCategoryStore } from '@/stores/product.category.store';

const productStore = useProductStore();
const productCategorystore = useCategoryStore();

const selectedStatusFilter = ref<any>('all');
const searchQuery = ref<any>('');

const filteredSales = computed(() => {
  let result = productStore.products;
  console.log(result);
  
  if (selectedStatusFilter.value !== 'all') {
    console.log(selectedStatusFilter.value);
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
  productStore.isEditModalOpen = true;
};

const openNewProductModal = () => {
  productStore.currentProduct = null;
  productStore.isEditModalOpen = true;
};

const handleProductSaved = (product: Product) => {
  console.log('Produit sauvegardé:', product);
};

onMounted(async () => {
  await productStore.fetchProducts();
});
</script>

<template>
  <section class="product-list-view">
    <div class="section-title">
      <Icon name="Package"/>
      <h1>Catalogue</h1>
    </div>
    <div v-if="productStore.isLoading">Chargement...</div>
    <div v-else-if="productStore.error" class="error">{{ productStore.error }}</div>
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
        <div class="rigth-filter-part">
          <div class="filter-group">
            <label for="status-filter">Filtres</label>
            <select 
              id="status-filter" 
              v-model="selectedStatusFilter" 
              class="status-filter"
            >
              <option value="all">Tous les statuts</option>
              <option 
                v-for="(category, value) in productCategorystore.categories" 
                :key="value" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="btn-secondary" v-on:click="openNewProductModal">Ajouter un produit</div>
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
        @close="productStore.closeProductDetail" 
        @edit="openEditModal"
      />
      <ProductEditModal
        :is-open="productStore.isEditModalOpen"
        @save="handleProductSaved"
      />
    </div>
  </section>
</template>