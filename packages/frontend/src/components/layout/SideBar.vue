<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Icon from '../common/Icon.vue';
import { useAuthStore } from '@/stores/auth.store';

const route = useRoute();

const authStore = useAuthStore();

const menuOpen = ref(false);

const menuItems = ref([
  { path: '/dashboard', label: 'Tableau de bord', icon: 'LayoutDashboard' },
  { path: '/products', label: 'Produits', icon: 'Package' },
  { path: '/sales', label: 'Ventes', icon: 'ShoppingCart' },
  { path: '/invoices', label: 'Factures', icon: 'FileText' },
  { path: '/user', label: 'Mon compte', icon: 'User' }
]);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  
  if (menuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const isActive = (path: string) => {
  if (route.path === path) return true;
  
  if (path !== '/' && route.path.startsWith(path)) return true;
  
  return false;
};

</script>

<template>
  <header class="sidebar">
    <div class="sidebar-content">

      <button class="burger-menu" v-on:click="toggleMenu" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <router-link to="/dashboard">
        <div class="logo-container">
          <img src="../../assets/images/flowbiz-logo.png" alt="FlowBiz Logo" class="logo" />
        </div>
      </router-link>
      
      <nav class="navigation" :class="{ 'active': menuOpen }">
        <ul class="nav-links">
          <template v-for="item in menuItems" :key="item.path">
            <router-link :to="item.path" v-on:click="toggleMenu">
              <li :class="{ 'active': isActive(item.path) }" class="btn">
                <Icon :name="item.icon"/>
                {{ item.label }}
              </li>
            </router-link>
          </template>
        </ul>
        <div class="btn-container">
          <router-link to="/" class="btn" v-on:click="authStore.logout">Déconnexion</router-link>
        </div>
      </nav>
    </div>
  </header>
</template>