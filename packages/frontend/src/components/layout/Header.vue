<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import useUserStore from '../../stores/useUserStore';

const style: CSSStyleDeclaration = getComputedStyle(document.body);

const userStore = useUserStore();

const { user } = storeToRefs(userStore);
const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  
  if (menuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

// const { authentication } = useAuthentication();

const userInitials = computed<string>(() => {
  return `${user.value.firstName[0]}${user.value.lastName[0]}`;
});

</script>

<template>
  <header class="header">
    <div class="header-content">
      <router-link to="/">
        <div class="logo-container">
          <img src="../../assets/images/flowbiz-logo.png" alt="FlowBiz Logo" class="logo" />
          <button class="burger-menu" @click="toggleMenu" aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </router-link>
      
      <nav class="navigation" :class="{ 'active': menuOpen }">
        <ul class="nav-links">
          <li><a href="#fonctions">Fonctionnalités</a></li>
          <li><a href="#prices">Tarifs</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        
        <div class="cta-container">
          <router-link to="/login" class="cta-secondary">Connexion</router-link>
          <router-link to="/register" class="cta-primary">S'inscrire</router-link>
        </div>
      </nav>
    </div>
  </header>
</template>