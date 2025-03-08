<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useSalesStore } from '@/stores/sales.store';
import { useProductStore } from '@/stores/product.store';
import { getInputFormatedDate, parseFormattedDate } from '@/utils/dateUtils';
import Icon from '@/components/common/Icon.vue';
import type { Sale, SaleCreateInput, SaleUpdateInput } from '@/types/models';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['save', 'close']);

const saleStore = useSalesStore();
const productStore = useProductStore();

const error = ref<string | null>(null);
const isSubmitting = ref(false);



const formData = reactive<SaleCreateInput & SaleUpdateInput>({
  buyerName: '',
  buyerAddress: '',
  status: 'pending',
  date: new Date().toISOString(),
  items: [],
  price: 0
});

const sale = ref<Sale | null>(null);
const isNewSale = computed(() => sale.value === null);

watch(() => [props.isOpen, saleStore.currentSale], () => {
  if (saleStore.currentSale !== null) {
    try {
      sale.value = saleStore.currentSale;
      console.log(sale.value.date);
      resetFormWithSale(sale.value);
    } catch (error: any) {
      error.value = "Vente non trouvée";
    }
  } else {
    sale.value = null;
    resetForm();
  }
});

const resetForm = () => {
  formData.buyerName = '';
  formData.buyerAddress = '';
  formData.status = 'pending';
  formData.date = new Date().toISOString();
  formData.items = [];
  formData.price = 0;
};

const resetFormWithSale = (sale: Sale) => {
  formData.buyerName = sale.buyerName || '';
  formData.buyerAddress = sale.buyerAddress || '';
  formData.buyerAddress = sale.status || 'pending';
  formData.date = getInputFormatedDate(sale.date) || new Date().toISOString();
  formData.items = [...sale.items];
  formData.price = typeof sale.price === 'string' ? parseFloat(sale.price) : sale.price;
};

const formatPrice = (price: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(numPrice);
};

const calculateTotalPrice = () => {
  return formData.items.reduce((total, item) => {
    const itemPrice = typeof item.unitPrice === 'string' ? 
      parseFloat(item.unitPrice) : item.unitPrice;
    return total + (itemPrice * item.quantity);
  }, 0);
};

watch(() => formData.items, () => {
  formData.price = calculateTotalPrice();
}, { deep: true });

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    error.value = null;
    
    const saleData = {
      buyerName: formData.buyerName,
      buyerAddress: formData.buyerAddress,
      status: formData.status,
      date: formData.date,
      items: formData.items,
      price: formData.price
    };

    if (typeof saleData.date === 'string') {
      saleData.date = parseFormattedDate(saleData.date);
    };
    
    let result;
    
    if (isNewSale.value) {
      result = await saleStore.createSale(saleData);
    } else {
      if (sale.value?.id) {
        result = await saleStore.updateSale(sale.value.id, saleData);
      } else {
        throw new Error("ID de vente manquant");
      }
    }

    emit('save', result);
    saleStore.closeSaleEdit();
    saleStore.fetchSales();
  } catch (err: any) {
    error.value = err.response?.data?.message || "Erreur lors de l'enregistrement de la vente";
  } finally {
    isSubmitting.value = false;
  }
};

const close = () => {
  saleStore.closeSaleEdit();
  emit('close');
};

const removeItem = (index: number) => {
  formData.items.splice(index, 1);
};

const addItem = () => {
  formData.items.push({
    productId: '',
    productName: '',
    quantity: 1,
    unitPrice: 0
  });
};

const selectProduct = async (index: number, productId: string) => {
  try {
    const product = await productStore.fetchProductById(productId);
    if (product) {
      formData.items[index].productName = product.name;
      formData.items[index].unitPrice = product.price;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
  }
};

onMounted(async () => {
  if (productStore.products.length === 0) {
    await productStore.fetchProducts();
  }
});
</script>

<template>
  <Transition name="modal-fade" appear>
    <div v-if="isOpen" class="modal-overlay" @click.self="close">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ isNewSale ? 'Ajouter une vente' : 'Modifier la vente' }}</h2>
          <button class="close-button" @click="close" aria-label="Fermer">
            <span>&times;</span>
          </button>
        </div>
        
        <div v-if="saleStore.isLoading" class="modal-loading">
          <div class="spinner"></div>
          <p>Chargement...</p>
        </div>
        
        <div v-else-if="error" class="modal-error">
          <p>{{ error }}</p>
          <button class="btn-primary" @click="close">Fermer</button>
        </div>
        
        <div v-else class="modal-content">
          <form @submit.prevent="handleSubmit" class="sale-form">
            <div class="form-section">
              <h3>Informations de l'acheteur</h3>
              
              <div class="form-group">
                <label for="buyer-name">Nom de l'acheteur*</label>
                <input 
                  id="buyer-name" 
                  v-model="formData.buyerName" 
                  type="text" 
                  required 
                  placeholder="Nom de l'acheteur"
                />
              </div>
              
              <div class="form-group">
                <label for="buyer-address">Adresse de l'acheteur*</label>
                <input 
                  id="buyer-address" 
                  v-model="formData.buyerAddress" 
                  type="text" 
                  required 
                  placeholder="Adresse de l'acheteur"
                />
              </div>

              <div class="form-group">
                <label for="sale-status">Statut de la commande*</label>
                <select v-model="formData.status">
                  <option 
                    v-for="status in Object.values(saleStore.SaleStatus)" 
                    :key="status" 
                    :value="status"
                  >
                    {{ saleStore.statusLabels[status] }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="sale-date">Date de vente*</label>
                <input 
                  id="sale-date" 
                  v-model="formData.date" 
                  type="date"
                  required
                />
              </div>
            </div>
            
            <div class="form-section">
              <div class="section-header">
                <h3>Produits</h3>
                <button type="button" class="btn-secondary btn-small" @click="addItem">
                  <Icon name="Plus" /> Ajouter un produit
                </button>
              </div>
              
              <div v-if="formData.items.length === 0" class="empty-items">
                <p>Aucun produit ajouté à cette vente</p>
              </div>
              
              <div v-else class="items-list">
                <div v-for="(item, index) in formData.items" :key="index" class="sale-item">
                  <div class="item-header">
                    <h4>Produit #{{ index + 1 }}</h4>
                    <button type="button" class="btn-danger btn-small" @click="removeItem(index)">
                      <Icon name="Trash" />
                    </button>
                  </div>
                  
                  <div class="form-row">
                    <div class="form-group">
                      <label :for="'product-id-' + index">Produit*</label>
                      <select 
                        :id="'product-id-' + index" 
                        v-model="item.productId"
                        @change="selectProduct(index, item.productId)"
                        required
                      >
                        <option value="">Sélectionnez un produit</option>
                        <option 
                          v-for="product in productStore.products" 
                          :key="product.id" 
                          :value="product.id"
                        >
                          {{ product.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="form-row">
                    <div class="form-group">
                      <label :for="'product-qty-' + index">Quantité*</label>
                      <input 
                        :id="'product-qty-' + index" 
                        v-model="item.quantity" 
                        type="number" 
                        min="1" 
                        required 
                      />
                    </div>
                    
                    <div class="form-group">
                      <label :for="'product-price-' + index">Prix unitaire*</label>
                      <input 
                        :id="'product-price-' + index" 
                        v-model="item.unitPrice" 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        required 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-section summary">
              <div class="total-price">
                <h3>Total:</h3>
                <h3 class="price">{{ formatPrice(formData.price) }}</h3>
              </div>
            </div>
            
            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="close">Annuler</button>
              <button 
                type="submit" 
                class="btn-primary"
                :disabled="isSubmitting || formData.items.length === 0"
              >
                {{ isSubmitting ? 'Enregistrement...' : (isNewSale ? 'Créer' : 'Enregistrer') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-content {
  padding: 16px;
}

.form-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.sale-item {
  background-color: #f5f5f5;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
}

.empty-items {
  text-align: center;
  padding: 20px;
  color: #666;
}

.summary {
  border: none;
}

.total-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2em;
  padding: 10px 0;
}

.price {
  color: #2563eb;
  font-weight: bold;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.btn-small {
  padding: 6px 12px;
  font-size: 0.85em;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
}

.btn-danger:hover {
  background-color: #dc2626;
}

/* Animation de transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>