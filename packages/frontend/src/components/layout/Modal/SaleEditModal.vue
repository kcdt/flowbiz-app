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
  formData.date = getInputFormatedDate(new Date().toISOString());
  formData.items = [];
  formData.price = 0;
};

const resetFormWithSale = (sale: Sale) => {
  formData.buyerName = sale.buyerName || '';
  formData.buyerAddress = sale.buyerAddress || '';
  formData.status = sale.status || 'pending';
  formData.date = getInputFormatedDate(sale.date) || getInputFormatedDate(new Date().toISOString());
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
    
    const saleData = {
      buyerName: formData.buyerName,
      buyerAddress: formData.buyerAddress,
      status: formData.status,
      date: typeof formData.date === 'string' ? parseFormattedDate(formData.date) : formData.date,
      items: formData.items,
      price: formData.price
    };
    
    let result;
    
    if (isNewSale.value) {
      result = await saleStore.createSale(saleData);
    } else if (sale.value?.id) {
      result = await saleStore.updateSale(sale.value.id, saleData);
    } else {
      throw new Error("ID de vente manquant");
    }
    
    saleStore.closeSaleEdit();
    
    saleStore.fetchSales().catch(console.error);
    
  } catch (err) {

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

const openDatePicker = (event: any) => {
  event.target.showPicker ? event.target.showPicker() : null;
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
                  @click="openDatePicker"
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
                    <button type="button" class="btn-warning btn-small" @click="removeItem(index)">
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
