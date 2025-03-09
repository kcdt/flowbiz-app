<script setup lang="ts">
import { ref } from 'vue';

const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  
  if (menuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

</script>

<template>
  <header class="header">
    <div class="header-content">

      <button class="burger-menu" v-on:click="toggleMenu" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <router-link to="/">
        <div class="logo-container">
          <img src="../../assets/images/flowbiz-logo.png" alt="FlowBiz Logo" class="logo" />
        </div>
      </router-link>
      
      <nav class="navigation" :class="{ 'active': menuOpen }">
        <ul class="nav-links">
          <li><a href="#features" v-on:click="toggleMenu">Fonctionnalités</a></li>
          <li><a href="#prices" v-on:click="toggleMenu">Tarifs</a></li>
          <li><a href="#contact" v-on:click="toggleMenu">Contact</a></li>
        </ul>
        
        <div class="btn-container">
          <router-link to="/login" class="btn-secondary" v-on:click="toggleMenu">Connexion</router-link>
          <router-link to="/register" class="btn-primary" v-on:click="toggleMenu">S'inscrire</router-link>
        </div>
      </nav>
    </div>
  </header>
</template>