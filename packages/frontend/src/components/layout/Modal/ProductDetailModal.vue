<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useProductStore } from '@/stores/product.store';
import { useCategoryStore } from '@/stores/product.category.store';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['edit']);

const productStore = useProductStore();
const categoryStore = useCategoryStore();

const product = computed(() => productStore.currentProduct);

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
  productStore.closeProductDetail();
};

const openProductEdit = () => {
  try {
    if (product.value) {
      productStore.openProductEdit(product.value.id);
    }
  } catch (err: any) {
    throw Error
  }
};

const deleteProduct = async () => {
  try {
    if (product.value) {
      await productStore.deleteProduct(product.value.id);
      close();
    }
  } catch (err: any) {
    throw Error
  }
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
          <h2>Détails du produit</h2>
          <button class="close-button" @click="close" aria-label="Fermer">
            <span>&times;</span>
          </button>
        </div>
        
        <div v-if="product" class="modal-content">
          <div class="product-details">
            <div class="product-image-container">
              <img 
                v-if="product.imageUrl" 
                :src="product.imageUrl" 
                :alt="product.name" 
                class="product-image"
              />
              <div v-else class="product-image-placeholder">
                <span>Aucune image</span>
              </div>
            </div>
            
            <div class="product-info">
              <div class="product-header">
                <h3 class="product-name">{{ product.name }}</h3>
                <div v-if="product.categoryId" class="product-category">
                  <span class="category-badge">{{ getCategoryName(product.categoryId) }}</span>
                </div>
              </div>
              
              <p v-if="product.description" class="product-description">{{ product.description }}</p>
              
              <div class="product-meta">
                <div class="meta-item">
                  <span class="meta-label">Prix:</span>
                  <span class="meta-value price">{{ formatPrice(product.price) }}</span>
                </div>
                
                <div class="meta-item">
                  <span class="meta-label">Quantité en stock:</span>
                  <span 
                    class="meta-value stock" 
                    :class="{
                      'low-stock': product.quantity < 5 && product.quantity > 0,
                      'out-of-stock': product.quantity <= 0
                    }"
                  >
                    {{ product.quantity }} unité{{ product.quantity !== 1 ? 's' : '' }}
                  </span>
                </div>
                
                <div class="meta-item">
                  <span class="meta-label">Dernière mise à jour:</span>
                  <span class="meta-value">{{ formatDate(product.updatedAt) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="btn-warning" @click="deleteProduct">Supprimer</button>
            <button class="btn-primary" @click="openProductEdit">Modifier</button>
          </div>
        </div>
        
        <div v-else class="modal-empty">
          <p>Aucun produit sélectionné</p>
          <button class="btn-primary" @click="close">Fermer</button>
        </div>
      </div>
    </div>
  </Transition>
</template>