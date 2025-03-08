<script setup lang="ts">
import { onMounted } from 'vue';
import { useProductStore } from '@/stores/product.store';
import ProductListItem from '@/components/products/ProductListItem.vue';
import Icon from '@/components/common/Icon.vue';
import ProductDetailModal from '@/components/layout/Modal/ProductDetailModal.vue';
import ProductEditModal from '@/components/layout/Modal/ProductEditModal.vue';
import { Product } from '@/types/models';

const productStore = useProductStore();

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
    <div v-else>
      <h3>Valeur totale du stock : {{ productStore.totalInventoryValue.toFixed(2) }} €</h3>
      <div class="btn-secondary" v-on:click="openNewProductModal">Ajouter un produit</div>
      <div class="product-list">
        <template v-for="product in productStore.products" :key="product.id">
          <ProductListItem :product="product" />
        </template>
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