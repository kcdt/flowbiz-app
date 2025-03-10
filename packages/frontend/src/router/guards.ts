import { Router } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

export function setupRouteGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
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