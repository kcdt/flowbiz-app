<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useSalesStore } from '@/stores/sales.store';
import { useProductStore } from '@/stores/product.store';
import { useCategoryStore } from '@/stores/product.category.store';
import { getFormatedDate } from '@/utils/dateUtils'
import Icon from '@/components/common/Icon.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'edit']);

const saleStore = useSalesStore();
const categoryStore = useCategoryStore();
const productStore = useProductStore();

const sale = computed(() => saleStore.currentSale);

const formatPrice = (price: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(numPrice);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getCategoryName = (categoryId: string) => {
  const category = categoryStore.categories.find((cat: { id: string; }) => cat.id === categoryId);
  return category ? category.name : 'Catégorie inconnue';
};

const close = () => {
  emit('close');
};

const openSaleEdit = () => {
  try {
    if (sale.value) {
      saleStore.openSaleEdit(sale.value.id);
    }
  } catch (err: any) {
    throw Error
  }
};

const deleteSale = () => {
  try {
    if (sale.value) {
      saleStore.deleteSale(sale.value.id);
      close();
    }
  } catch (err: any) {
    throw Error
  }
};

const openProductDetails = (id: string) => {
  close();
  setTimeout(() => {
    productStore.openProductDetail(id);
  }, 750);
};

onMounted(async () => {
  if (categoryStore.categories.length === 0) {
    await categoryStore.fetchCategories();
  }
});
</script>

<template>
  <Transition name="modal-fade" appear>
    <div v-if="isOpen" class="modal-overlay" @click.self="close">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Détails de la vente</h2>
          <button class="close-button" @click="close" aria-label="Fermer">
            <span>&times;</span>
          </button>
        </div>
        
        <div v-if="sale" class="modal-content">
          <div class="sale-details">
            <div class="sale-info">
              <div class="sale-header">
                <div class="info-block">
                  <h4 class="text-legend">Nom de l'acheteur :</h4>
                  <h3 class="sale-buyer-name">{{ sale.buyerName }}</h3>
                </div>
                <div class="info-block">
                  <h4 class="text-legend">Statut de la vente :</h4>
                  <h4 class="sale-address" :class="sale.status">{{ saleStore.statusLabels[sale.status] }}</h4>
                </div>
                <div class="info-block">
                  <h4 class="text-legend">Adresse de l'acheteur :</h4>
                  <h3 class="sale-address">{{ sale.buyerAddress }}</h3>
                </div>
                <div class="info-block">
                  <h4 class="text-legend">Date de vente :</h4>
                  <h3 class="sale-address">{{ getFormatedDate(sale.date) }}</h3>
                </div>
              </div>
                          
              <div class="sale-meta">
                <h3>Détails de la commande</h3>
                <template v-for="item in sale.items">
                  <div class="resume-sale-item">
                    <div class="action">
                      <router-link to="/products" v-on:click="openProductDetails(item.productId)">
                      <Icon name="Eye"/>
                    </router-link>
                    </div>
                    <div class="sale-item-infos">
                      <div class="main-info">
                        <h3>{{ item.productName }}</h3>
                      </div>
                      <h4>{{ item.quantity }} pc</h4>
                      <h4 class="highligth-info">{{ item.unitPrice }} €</h4>
                    </div>
                  </div>
                </template>

                <div class="row-item">
                  <span class="meta-label">Total:</span>
                  <span class="meta-value">
                    <h3 class="highligth-info">{{ formatPrice(sale.price) }}</h3>
                  </span>
                </div>
                
                <div class="row-item">
                  <span class="meta-label">Dernière mise à jour:</span>
                  <span class="meta-value">{{ formatDate(sale.updatedAt) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="btn-warning" @click="deleteSale">Supprimer</button>
            <button class="btn-primary" @click="openSaleEdit">Modifier</button>
          </div>
        </div>
        
        <div v-else class="modal-empty">
          <p>Aucune vente sélectionnée</p>
          <button class="btn-primary" @click="close">Fermer</button>
        </div>
      </div>
    </div>
  </Transition>
</template>