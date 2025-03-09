<script setup lang="ts">
import { useUserStore } from '@/stores/user.store';
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import Icon from '@/components/common/Icon.vue';
import type { UserUpdateInput } from '@/types/models';

const userStore = useUserStore();
const router = useRouter();

const isEditMode = ref(false);
const isChangingPassword = ref(false);
const isSaving = ref(false);
const formError = ref<string | null>(null);
const deleteConfirmation = ref(false);

const formData = reactive<UserUpdateInput>({
  name: '',
  email: '',
  phone: ''
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const initForm = () => {
  if (userStore.currentUser) {
    formData.name = userStore.currentUser.name || '';
    formData.email = userStore.currentUser.email || '';
    formData.phone = userStore.currentUser.phone || '';
  }
};

const enableEditMode = () => {
  initForm();
  isEditMode.value = true;
};

const cancelEdit = () => {
  isEditMode.value = false;
  isChangingPassword.value = false;
  formError.value = null;
};

const saveChanges = async () => {
  try {
    isSaving.value = true;
    formError.value = null;

    if (!userStore.currentUser) return;

    await userStore.updateUser(userStore.currentUser.id, formData);
    isEditMode.value = false;
  } catch (error: any) {
    formError.value = error.message || "Une erreur est survenue lors de la mise à jour du profil";
  } finally {
    isSaving.value = false;
    userStore.fetchCurrentUser();
  }
};

const changePassword = async () => {
  try {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      formError.value = "Les mots de passe ne correspondent pas";
      return;
    }

    isSaving.value = true;
    formError.value = null;

    if (!userStore.currentUser) return;

    await userStore.updatePassword(
      userStore.currentUser.id,
      passwordForm.currentPassword,
      passwordForm.newPassword
    );

    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    
    isChangingPassword.value = false;
  } catch (error: any) {
    formError.value = error.message || "Une erreur est survenue lors du changement de mot de passe";
  } finally {
    isSaving.value = false;
  }
};

const deleteAccount = async () => {
  try {
    if (!userStore.currentUser) return;
    
    await userStore.deleteUser(userStore.currentUser.id);
    router.push('/login');
  } catch (error: any) {
    formError.value = error.message || "Une erreur est survenue lors de la suppression du compte";
  }
};

onMounted(async () => {
  try {
    await userStore.fetchCurrentUser();
    await userStore.fetchUserCompany();
    initForm();
  } catch (error) {
  }
});
</script>

<template>
  <section class="user-view">
    <div class="section-title">
      <Icon name="User"/>
      <h1>Mon profil</h1>
    </div>
    
    <div v-if="userStore.isLoading" class="loading">
      <div class="spinner"></div>
      <p>Chargement...</p>
    </div>
    
    <div v-else-if="userStore.error" class="error-message">
      {{ userStore.error }}
    </div>
    
    <div v-else-if="userStore.currentUser" class="profile-content">
      <div v-if="!isEditMode" class="profile-card">
        <div class="profile-header">
          <div class="avatar">
            {{ userStore.currentUser.name?.charAt(0) }}
          </div>
          <div class="profile-title">
            <h2>{{ userStore.currentUser.name }}</h2>
            <span class="role-badge">{{ userStore.currentUser.role }}</span>
          </div>
        </div>
        
        <div class="profile-details">
          <div class="detail-item">
            <span class="detail-label">Email:</span>
            <span class="detail-value">{{ userStore.currentUser.email }}</span>
          </div>
          
          <div class="detail-item" v-if="userStore.currentUser.phone">
            <span class="detail-label">Téléphone:</span>
            <span class="detail-value">{{ userStore.currentUser.phone }}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">Entreprise:</span>
            <span class="detail-value">{{ userStore.currentUserCompany?.name || 'Non spécifiée' }}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">Membre depuis:</span>
            <span class="detail-value">{{ new Date(userStore.currentUser.createdAt).toLocaleDateString('fr-FR') }}</span>
          </div>
        </div>
        
        <div class="profile-actions">
          <button class="btn-primary" @click="enableEditMode">
            <Icon name="Edit" />
            Modifier le profil
          </button>
          
          <button class="btn-outline" @click="isChangingPassword = true">
            <Icon name="Lock" />
            Changer le mot de passe
          </button>
          
          <button class="btn-warning" @click="deleteConfirmation = true">
            <Icon name="Trash" />
            Supprimer le compte
          </button>
        </div>
      </div>
      
      <div v-else class="edit-form">
        <h2>Modifier mon profil</h2>
        
        <div v-if="formError" class="form-error">
          {{ formError }}
        </div>
        
        <form @submit.prevent="saveChanges">
          <div class="form-group">
            <label for="name">Nom</label>
            <input 
              id="name" 
              v-model="formData.name" 
              type="text" 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              v-model="formData.email" 
              type="email" 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="phone">Téléphone</label>
            <input 
              id="phone" 
              v-model="formData.phone" 
              type="tel"
            />
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="cancelEdit" :disabled="isSaving">
              Annuler
            </button>
            <button type="submit" class="btn-primary" :disabled="isSaving">
              {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
      
      <Transition name="modal-fade" appear>
        <div v-if="isChangingPassword" class="modal-overlay">
          <div class="modal-container">
            <div class="modal-header">
              <h3>Changer le mot de passe</h3>
              <button class="close-button" @click="isChangingPassword = false">&times;</button>
            </div>
            
            <div class="modal-content">
              <div v-if="formError" class="form-error">
                {{ formError }}
              </div>
              
              <form @submit.prevent="changePassword">
                <div class="form-group">
                  <label for="currentPassword">Mot de passe actuel</label>
                  <input 
                    id="currentPassword" 
                    v-model="passwordForm.currentPassword" 
                    type="password" 
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="newPassword">Nouveau mot de passe</label>
                  <input 
                    id="newPassword" 
                    v-model="passwordForm.newPassword" 
                    type="password" 
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="confirmPassword">Confirmer le mot de passe</label>
                  <input 
                    id="confirmPassword" 
                    v-model="passwordForm.confirmPassword" 
                    type="password" 
                    required
                  />
                </div>
                
                <div class="form-actions">
                  <button type="button" class="btn-secondary" @click="isChangingPassword = false" :disabled="isSaving">
                    Annuler
                  </button>
                  <button type="submit" class="btn-primary" :disabled="isSaving">
                    {{ isSaving ? 'Enregistrement...' : 'Changer le mot de passe' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="modal-fade" appear>
        <div v-if="deleteConfirmation" class="modal-overlay">
          <div class="modal-container">
            <div class="modal-header">
              <h3>Supprimer le compte</h3>
              <button class="close-button" @click="deleteConfirmation = false">&times;</button>
            </div>
            
            <div class="modal-content">
              <p class="confirmation-message">
                Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
              </p>
              
              <div class="form-actions">
                <button class="btn-secondary" @click="deleteConfirmation = false">
                  Annuler
                </button>
                <button class="btn-warning" @click="deleteAccount">
                  Supprimer définitivement
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    
    <div v-else class="not-logged-in">
      <p>Veuillez vous connecter pour accéder à votre profil.</p>
    </div>
  </section>
</template>