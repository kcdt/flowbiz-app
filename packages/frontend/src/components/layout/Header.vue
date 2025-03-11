<script setup lang="ts">
import router from '@/router';
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

const closeMenu = () => {
  menuOpen.value = false;
  document.body.style.overflow = '';
};

const scrollToSection = async (id: string) => {
  closeMenu();
  const isHomePage = router.currentRoute.value.name === 'home';
  
  if (!isHomePage) {
    await router.push({ name: 'home', query: { scrollTo: id } });
    
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  } else {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
          <li><a @click.prevent="scrollToSection('features')" v-on:click="closeMenu">Fonctionnalités</a></li>
          <li><a @click.prevent="scrollToSection('contact')" v-on:click="closeMenu">Contact</a></li>
        </ul>
        
        <div class="btn-container">
          <router-link to="/login" class="btn-secondary" v-on:click="closeMenu">Connexion</router-link>
          <router-link to="/register" class="btn-primary" v-on:click="closeMenu">S'inscrire</router-link>
        </div>
      </nav>
    </div>
  </header>
</template>