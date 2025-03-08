<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useProductStore } from '@/stores/product.store';
import { useCategoryStore } from '@/stores/product.category.store';
import type { Product, ProductCreateInput, ProductUpdateInput } from '@/types/models';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['save']);

const productStore = useProductStore();
const categoryStore = useCategoryStore();

const error = ref<string | null>(null);
const isSubmitting = ref(false);

const formData = reactive<ProductCreateInput & ProductUpdateInput>({
  name: '',
  description: '',
  price: 0,
  quantity: 0,
  categoryId: '',
  imageUrl: ''
});

const product = ref<Product | null>(null);

const isNewProduct = computed(() => product == null);

watch(() => [props.isOpen, productStore.currentProduct], () => {
  if (productStore.currentProduct !== null) {
      try {
        product.value = productStore.currentProduct;
        resetFormWithProduct(product.value);
      } catch (error: any) {
        error.value = "Produit non trouvé";
      }
    } else {
      product.value = null;
      resetForm();
    }
  }
);

const resetForm = () => {
  formData.name = '';
  formData.description = '';
  formData.price = 0;
  formData.quantity = 0;
  formData.categoryId = '';
  formData.imageUrl = '';
};

const resetFormWithProduct = (product: any) => {
  formData.name = product.name || '';
  formData.description = product.description || '';
  formData.price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  formData.quantity = product.quantity || 0;
  formData.categoryId = product.categoryId || '';
  formData.imageUrl = product.imageUrl || '';
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    error.value = null;
    
    const productData = {
      name: formData.name,
      description: formData.description || undefined,
      price: formData.price,
      quantity: formData.quantity,
      categoryId: formData.categoryId || undefined,
      imageUrl: formData.imageUrl || undefined
    };
    
    let result;
    
    if (isNewProduct) {
      result = await productStore.createProduct(productData);
    } else {
      if (product.value?.id) {
        result = await productStore.updateProduct(product.value.id, productData);
      } else {
        throw new Error("Product ID is missing");
      }
    }

    emit('save', result);
    productStore.closeProductEdit();
    productStore.fetchProducts();
  } catch (err: any) {
    error.value = err.response?.data?.message || "Erreur lors de l'enregistrement du produit";
  } finally {
    isSubmitting.value = false;
  }
};

const close = () => {
  productStore.closeProductEdit();
};

onMounted(async () => {
  if (categoryStore.categories.length === 0) {
    await categoryStore.fetchCategories();
  }
});
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <div class="modal-header">
        <h2>{{ product ? 'Modifier le produit' : 'Ajouter un produit' }}</h2>
        <button class="close-button" @click="close" aria-label="Fermer">
          <span>&times;</span>
        </button>
      </div>
      
      <div v-if="productStore.isLoading" class="modal-loading">
        <div class="spinner"></div>
        <p>Chargement...</p>
      </div>
      
      <div v-else-if="error" class="modal-error">
        <p>{{ error }}</p>
        <button class="btn-primary" @click="close">Fermer</button>
      </div>
      
      <div v-else class="modal-content">
        <form @submit.prevent="handleSubmit" class="product-form">
          <div class="form-group">
            <label for="product-name">Nom du produit*</label>
            <input 
              id="product-name" 
              v-model="formData.name" 
              type="text" 
              required 
              placeholder="Nom du produit"
            />
          </div>
          
          <div class="form-group">
            <label for="product-description">Description</label>
            <textarea 
              id="product-description" 
              v-model="formData.description" 
              rows="3" 
              placeholder="Description du produit"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="product-price">Prix*</label>
              <input 
                id="product-price" 
                v-model="formData.price" 
                type="number" 
                step="0.01" 
                min="0" 
                required 
                placeholder="0.00"
              />
            </div>
            
            <div class="form-group">
              <label for="product-quantity">Quantité en stock*</label>
              <input 
                id="product-quantity" 
                v-model="formData.quantity" 
                type="number" 
                min="0" 
                required 
                placeholder="0"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="product-category">Catégorie</label>
            <select id="product-category" v-model="formData.categoryId">
              <option value="">Aucune catégorie</option>
              <option 
                v-for="category in categoryStore.categories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="product-image">URL de l'image</label>
            <input 
              id="product-image" 
              v-model="formData.imageUrl" 
              type="url" 
              placeholder="https://exemple.com/image.jpg"
            />
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="close">Annuler</button>
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Enregistrement...' : (product ? 'Enregistrer' : 'Créer') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>