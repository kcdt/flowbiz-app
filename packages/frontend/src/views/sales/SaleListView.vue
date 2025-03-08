<script setup lang="ts">
import { onMounted } from 'vue';
import { useSalesStore } from '../../stores/sales.store';
import Icon from '@/components/common/Icon.vue';
import SaleListItem from '@/components/sales/SaleListItem.vue';
import SaleDetailModal from '@/components/layout/Modal/SaleDetailModal.vue';
import SaleEditModal from '@/components/layout/Modal/SaleEditModal.vue';

const saleStore = useSalesStore();

const openEditModal = () => {
  saleStore.isEditModalOpen = true;
};

const openNewSaleModal = () => {
  saleStore.currentSale = null;
  saleStore.isEditModalOpen = true;
};

const handleProductSaved = (sale: any) => {
  console.log('Vente sauvegardé:', sale);
};

onMounted(async () => {
  await saleStore.fetchSales();
});
</script>

<template>
  <section class="sales-list-view">
    <div class="section-title">
      <Icon name="ShoppingCart"/>
      <h1>Ventes</h1>
    </div>
    <div v-if="saleStore.isLoading">Chargement...</div>
    <div v-else-if="saleStore.error" class="error">{{ saleStore.error }}</div>
    <div v-else>
      <div class="btn-secondary" v-on:click="openNewSaleModal">Ajouter une vente</div>
      <div class="sale-list">
        <template v-for="sale in saleStore.sales" :key="sale.id">
          <SaleListItem :sale="sale"/>
        </template>
      </div>
      <SaleDetailModal 
        :is-open="saleStore.isDetailModalOpen" 
        @close="saleStore.closeSaleDetail" 
        @edit="openEditModal"
      />
      <SaleEditModal
        :is-open="saleStore.isEditModalOpen"
        @save="handleProductSaved"
      />
    </div>
  </section>
</template>