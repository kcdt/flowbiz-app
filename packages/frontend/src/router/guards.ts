import { Router } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

export function setupRouteGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    if (to.path === from.path && to.hash !== from.hash) {
      return next();
    }
    
    const authStore = useAuthStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
    if (!authStore.isAuthenticated) {
      try {
        await authStore.checkAuth();
      } catch (error) {
        console.log("Route guard: échec du rafraîchissement silencieux");
      }
    }
    
    if (requiresAuth && !authStore.isAuthenticated) {
      return next({
        name: 'login',
        query: { redirect: to.fullPath }
      });
    }
    
    if (authStore.isAuthenticated && (to.name === 'login' || to.name === 'register')) {
      return next({ name: 'dashboard' });
    }
    
    next();
  });
}