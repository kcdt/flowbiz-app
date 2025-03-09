import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { setupRouteGuards } from '@/router/guards';
import authRoutes from '@/router/routes/auth.routes';
import productRoutes from '@/router/routes/products.routes';
import salesRoutes from '@/router/routes/sales.routes';
import invoiceRoutes from '@/router/routes/invoices.routes';
import usersRoutes from './routes/users.routes';
import HomeView from '../views/HomeView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import usersRoutes from './routes/users.routes';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  ...authRoutes,
  ...productRoutes,
  ...salesRoutes,
  ...invoiceRoutes,
  ...usersRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL || '/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

setupRouteGuards(router);

export default router;