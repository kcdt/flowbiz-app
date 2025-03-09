import { RouteRecordRaw } from 'vue-router';
import SaleListView from '../../views/sales/SaleListView.vue';

const salesRoutes: Array<RouteRecordRaw> = [
  {
    path: '/sales',
    name: 'sales',
    component: SaleListView,
    meta: { requiresAuth: true }
  }
];

export default salesRoutes;