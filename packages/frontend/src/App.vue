<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import TheHeader from '@/components/layout/Header.vue';
import TheSidebar from '@/components/layout/SideBar.vue';

const route = useRoute();

const showVisitorLayout = computed(() => {
  const authRoutes = ['home', 'login', 'register'];
  return authRoutes.includes(route.name as string);
});
</script>

<template>
  <TheHeader v-if="showVisitorLayout" />
  
  <div class="main-container">
    <TheSidebar v-if="!showVisitorLayout" />
    
    <main class="content" :class="!showVisitorLayout ? 'app-content' : 'full-width'">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
  </template>