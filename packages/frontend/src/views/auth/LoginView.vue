<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value);
  } catch (error) {
    console.error('Erreur de connexion');
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Connexion</h1>
      
      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            placeholder="Votre email" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            placeholder="Votre mot de passe" 
            required
          />
        </div>
        
        <button 
          type="submit" 
          class="btn-primary"
          :disabled="authStore.isLoading"
        >
          {{ authStore.isLoading ? 'Connexion en cours...' : 'Se connecter' }}
        </button>
      </form>
      
      <div class="login-footer">
        <p>Pas encore de compte ?</p>
        <router-link to="/register" class="link">S'inscrire</router-link>
      </div>
    </div>
  </div>
</template>