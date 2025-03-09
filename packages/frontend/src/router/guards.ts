import { Router } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

export function setupRouteGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
    if (requiresAuth && !authStore.isAuthenticated) {
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      });
      return;
    }
    
    if (to.name === 'login' || to.name === 'register') {
      if (authStore.isAuthenticated) {
        next({ name: 'dashboard' });
        return;
      }
    }
    
    next();
  });
}