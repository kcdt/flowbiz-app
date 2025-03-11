<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import Icon from '@/components/common/Icon.vue';

const authStore = useAuthStore();

const formData = reactive({
  userName: '',
  userEmail: '',
  userPhone: '',
  password: '',
  role: 'admin_seller' as 'admin_seller',
  companyName: '',
  companyAddress: '',
  companyPhone: '',
  companyEmail: '',
  taxId: ''
});

const checkedCompanyInfo = ref<boolean>(false);

watch(checkedCompanyInfo, (newValue) => {
  if (newValue) {
    formData.companyEmail = formData.userEmail;
    formData.companyPhone = formData.userPhone;
  } else {
    formData.companyEmail = '';
    formData.companyPhone = '';
  }
});

const handleRegister = async () => {
  try {
    await authStore.register(formData);
  } catch (error) {
    console.error('Erreur d\'inscription');
  }
};
</script>

<template>
  <div class="public-content">
    <div class="register-container">
      <div class="register-card">
        <h1 class="register-title">Créer un compte</h1>
        
        <div v-if="authStore.error" class="error-message">
          <p>
            {{ authStore.error }}
          </p>
          <button class="btn">
            <Icon name="X" color="black" v-on:click="authStore.error = null"/>
          </button>
        </div>
        
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-section-container">
            <div class="form-section">
              <h2 class="section-title">Informations utilisateur</h2>
              
              <div class="form-group">
                <label for="userName">Nom complet*</label>
                <input 
                  id="userName" 
                  v-model="formData.userName" 
                  type="text" 
                  placeholder="Votre nom complet" 
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="userEmail">Email*</label>
                <input 
                  id="userEmail" 
                  v-model="formData.userEmail" 
                  type="email" 
                  placeholder="votreemail@exemple.com" 
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="userPhone">Téléphone*</label>
                <input 
                  id="userPhone" 
                  v-model="formData.userPhone" 
                  type="tel" 
                  placeholder="+33 6 12 34 56 78" 
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="password">Mot de passe*</label>
                <input 
                  id="password" 
                  v-model="formData.password" 
                  type="password" 
                  placeholder="8 caractères minimum" 
                  required
                />
              </div>
              
            </div>
            
            <div class="heading-company-section">
              <h2 class="section-title">Informations entreprise</h2>
              <p>Ces informations sont nécéssaires pour la génération de factures</p>
              <div 
                class="company-info-option"
                v-on:click="checkedCompanyInfo = !checkedCompanyInfo"
              >
                <input 
                  id="setCompanyInfo"
                  v-model="checkedCompanyInfo"
                  type="checkbox"
                >
                  <p>Utiliser le numéro de téléphone et l'email de l'utilisateur</p>
                </input>
              </div>
            </div>
            
            <div class="form-section">

              <div class="form-group">
                <label for="companyName">Nom de l'entreprise*</label>
                <input 
                  id="companyName" 
                  v-model="formData.companyName" 
                  type="text" 
                  placeholder="Nom de votre entreprise" 
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="companyAddress">Adresse*</label>
                <textarea 
                  id="companyAddress"
                  v-model="formData.companyAddress" 
                  placeholder="Adresse complète" 
                  rows="3" 
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="companyPhone">Téléphone entreprise*</label>
                <input 
                  id="companyPhone" 
                  v-model="formData.companyPhone" 
                  type="tel" 
                  placeholder="+33 1 23 45 67 89" 
                />
              </div>
              
              <div class="form-group">
                <label for="companyEmail">Email entreprise*</label>
                <input 
                  id="companyEmail"
                  v-model="formData.companyEmail" 
                  type="email"
                  placeholder="contact@votreentreprise.com" 
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="taxId">SIRET (optionnel)</label>
                <input 
                  id="taxId" 
                  v-model="formData.taxId"
                  type="text" 
                  placeholder="123 456 789 00012" 
                />
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="authStore.isLoading"
            >
              {{ authStore.isLoading ? 'Inscription en cours...' : 'S\'inscrire' }}
            </button>
          </div>
        </form>
        
        <div class="register-footer">
          <p>Déjà un compte ?</p>
          <router-link to="/login" class="link">Se connecter</router-link>
        </div>
      </div>
    </div>
  </div>
</template>