import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { setupRouteGuards } from '@/router/guards';
import authRoutes from '@/router/routes/auth.routes';
import productRoutes from '@/router/routes/products.routes';
import saleRoutes from '@/router/routes/sales.routes';
import invoiceRoutes from '@/router/routes/invoices.routes';
import HomeView from '../views/HomeView.vue';
import DashboardView from '../views/dashboard/DashboardView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => HomeView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => DashboardView,
    meta: { requiresAuth: true },
  },
  ...authRoutes,
  ...productRoutes,
  ...saleRoutes,
  ...invoiceRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => NotFoundView
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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