<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useSalesStore } from '../../stores/sales.store';
import Icon from '@/components/common/Icon.vue';
import SaleListItem from '@/components/sales/SaleListItem.vue';
import SaleDetailModal from '@/components/layout/modal/SaleDetailModal.vue';
import SaleEditModal from '@/components/layout/modal/SaleEditModal.vue';

const saleStore = useSalesStore();

const selectedStatusFilter = ref<any>('all');
const searchQuery = ref<any>('');

const filteredSales = computed(() => {
  let result = saleStore.sales;
  
  if (selectedStatusFilter.value !== 'all') {
    console.log(selectedStatusFilter.value);
    result = result.filter(sale => sale.status === selectedStatusFilter.value);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(sale => 
      sale.buyerName.toLowerCase().includes(query)
    );
  }
  
  return result;
});

const openEditModal = () => {
  saleStore.isEditModalOpen = true;
};

const openNewSaleModal = () => {
  saleStore.currentSale = null;
  saleStore.isEditModalOpen = true;
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
    <div v-else class="list-view-content">
      <div class="filter-container">
        <div class="search-container">
          <div class="search-group">
            <label for="search-input" class="sr-only">Rechercher</label>
            <div class="search-input-wrapper">
              <input
                id="search-input"
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher par nom client"
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
              <option value="all">Tous les statuts</option>
              <option 
                v-for="(label, value) in saleStore.SaleStatus" 
                :key="value" 
                :value="label"
              >
                {{ saleStore.statusLabels[label] }}
              </option>
            </select>
          </div>
          <div class="btn-secondary" v-on:click="openNewSaleModal">Ajouter une vente</div>
        </div>
      </div>
      <div v-if="saleStore.error" class="error-message">{{ saleStore.error }}</div>
      <div class="sales-list">
        <div v-for="sale in filteredSales" :key="sale.id" class="sale-item">
          <SaleListItem :sale="sale"/>
        </div>
        <div v-if="filteredSales.length === 0" class="empty-state">
          <p>Aucune vente ne correspond à votre recherche</p>
        </div>
      </div>
      <SaleDetailModal 
        :is-open="saleStore.isDetailModalOpen" 
        @close="saleStore.closeSaleDetail" 
        @edit="openEditModal"
      />
      <SaleEditModal
        :is-open="saleStore.isEditModalOpen"
      />
    </div>
  </section>
</template>