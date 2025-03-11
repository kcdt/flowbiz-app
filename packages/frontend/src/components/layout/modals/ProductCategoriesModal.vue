<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useCategoryStore } from '@/stores/product.category.store';
import Icon from '@/components/common/Icon.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const categoryStore = useCategoryStore();
const categories = computed(() => categoryStore.categories);
const isLoading = ref(false);
const currentMode = ref('list'); // 'list', 'add', 'edit', 'delete'
const currentCategory = ref<any>(null);
const formCategory = ref({
  id: '',
  name: '',
  description: ''
});

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

const switchToList = () => {
  currentMode.value = 'list';
  currentCategory.value = null;
};

const switchToAdd = () => {
  currentMode.value = 'add';
  formCategory.value = { id: '', name: '', description: '' };
};

const switchToEdit = (category: any) => {
  currentMode.value = 'edit';
  currentCategory.value = category;
  formCategory.value = { ...category };
};

const switchToDelete = (category: any) => {
  currentMode.value = 'delete';
  currentCategory.value = category;
};

const close = () => {
  categoryStore.closeProductCategoriesModal();
};

const addCategory = async () => {
  try {
    isLoading.value = true;
    if (!formCategory.value.name.trim()) {
      alert('Le nom de la catégorie est obligatoire');
      return;
    }
    
    await categoryStore.createCategory({
      name: formCategory.value.name,
      description: formCategory.value.description || ''
    });
    
    switchToList();
  } catch (error: any) {
    alert(`Erreur lors de la création: ${error.message}`);
  } finally {
    isLoading.value = false;
  }
};

const updateCategory = async () => {
  try {
    isLoading.value = true;
    if (!formCategory.value.name.trim()) {
      alert('Le nom de la catégorie est obligatoire');
      return;
    }
    
    await categoryStore.updateCategory(formCategory.value.id, {
      name: formCategory.value.name,
      description: formCategory.value.description || ''
    });
    
    switchToList();
  } catch (error: any) {
    alert(`Erreur lors de la modification: ${error.message}`);
  } finally {
    isLoading.value = false;
  }
};

const deleteCategory = async () => {
  try {
    isLoading.value = true;
    if (currentCategory.value) {
      await categoryStore.deleteCategory(currentCategory.value.id);
      switchToList();
    }
  } catch (error: any) {
    alert(`Erreur lors de la suppression: ${error.message}`);
  } finally {
    isLoading.value = false;
  }
};

watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    try {
      isLoading.value = true;
      await categoryStore.fetchCategories();
      currentMode.value = 'list';
    } catch (error: any) {
      alert(`Erreur lors du chargement des catégories: ${error.message}`);
    } finally {
      isLoading.value = false;
    }
  }
});

onMounted(async () => {
  if (props.isOpen && categories.value.length === 0) {
    try {
      isLoading.value = true;
      await categoryStore.fetchCategories();
    } catch (error: any) {
      alert(`Erreur lors du chargement des catégories: ${error.message}`);
    } finally {
      isLoading.value = false;
    }
  }
});
</script>

<template>
  <Transition name="modal-fade" appear>
    <div v-if="isOpen" class="modal-overlay" @click.self="close">
      <div class="modal-container">
        <div class="modal-header">
          <h2>
            <template v-if="currentMode === 'list'">Gestion des catégories</template>
            <template v-else-if="currentMode === 'add'">Ajouter une catégorie</template>
            <template v-else-if="currentMode === 'edit'">Modifier la catégorie</template>
            <template v-else-if="currentMode === 'delete'">Confirmer la suppression</template>
          </h2>
          <button class="close-button" @click="close" aria-label="Fermer">
            <span>&times;</span>
          </button>
        </div>
        
        <div class="modal-content product-category-modal">
          <div v-if="currentMode === 'list'">
            <div class="list-header">
              <button class="btn-primary" @click="switchToAdd">
                <i class="fas fa-plus"></i> Ajouter une catégorie
              </button>
            </div>
            
            <div v-if="isLoading" class="loading-state">
              <div class="spinner"></div>
              <span>Chargement des catégories...</span>
            </div>
            
            <div v-else-if="categories.length === 0" class="empty-state">
              <p>Aucune catégorie n'a été créée</p>
              <button class="btn-primary" @click="switchToAdd">Créer votre première catégorie</button>
            </div>
            
            <div v-else class="categories-list">
              <div v-for="category in categories" :key="category.id" class="category-item">
                <div class="category-content">
                  <h3 class="category-name">{{ category.name }}</h3>
                  <p v-if="category.description" class="category-description">{{ category.description }}</p>
                  <p v-else class="category-description empty">Aucune description</p>
                  
                  <div v-if="category.updatedAt" class="category-date">
                    Dernière mise à jour: {{ formatDate(category.updatedAt) }}
                  </div>
                </div>
                
                <div class="category-actions">
                  <button class="btn-icon edit" @click="switchToEdit(category)" title="Modifier">
                    <Icon name="Edit"/>
                  </button>
                  <button class="btn-icon delete" @click="switchToDelete(category)" title="Supprimer">
                    <Icon name="Trash"/>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else-if="currentMode === 'add' || currentMode === 'edit'">
            <form @submit.prevent="currentMode === 'add' ? addCategory() : updateCategory()">
              <div class="form-group">
                <label for="category-name">Nom <span class="required">*</span></label>
                <input
                  id="category-name"
                  type="text"
                  v-model="formCategory.name"
                  required
                  placeholder="Nom de la catégorie"
                  class="form-control"
                />
              </div>
              
              <div class="form-group">
                <label for="category-description">Description</label>
                <textarea
                  id="category-description"
                  v-model="formCategory.description"
                  placeholder="Description de la catégorie"
                  class="form-control"
                  rows="4"
                ></textarea>
              </div>
              
              <div class="form-actions">
                <button type="button" class="btn-secondary" @click="switchToList">Annuler</button>
                <button type="submit" class="btn-primary" :disabled="isLoading">
                  <template v-if="isLoading">
                    <span v-if="currentMode === 'add'">Création en cours...</span>
                    <span v-else>Mise à jour en cours...</span>
                  </template>
                  <template v-else>
                    <span v-if="currentMode === 'add'">Créer</span>
                    <span v-else>Enregistrer</span>
                  </template>
                </button>
              </div>
            </form>
          </div>
          
          <div v-else-if="currentMode === 'delete'" class="delete-confirmation">
            <p class="confirmation-message">
              Êtes-vous sûr de vouloir supprimer la catégorie 
              <strong>{{ currentCategory?.name }}</strong> ?
            </p>
            <p class="warning-message">
              Cette action est irréversible. Vérifiez qu'il n'y ai pas de produits associés à cette catégorie.
            </p>
            
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="switchToList">Annuler</button>
              <button 
                type="button" 
                class="btn-warning" 
                @click="deleteCategory" 
                :disabled="isLoading"
              >
                <span v-if="isLoading">Suppression en cours...</span>
                <span v-else>Confirmer la suppression</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>