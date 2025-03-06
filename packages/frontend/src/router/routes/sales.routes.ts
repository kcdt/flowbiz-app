import { RouteRecordRaw } from 'vue-router';

const SaleListView = () => import('../../views/sales/SaleListView.vue')

const salesRoutes: Array<RouteRecordRaw> = [
  {
    path: '/sales',
    name: 'sales',
    component: SaleListView,
    meta: { requiresAuth: true }
  }
];

export default salesRoutes;
