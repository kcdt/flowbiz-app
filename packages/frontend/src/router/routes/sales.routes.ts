import { RouteRecordRaw } from 'vue-router';
import SaleListView from '../../views/sales/SaleListView.vue';
import SaleFormView from '../../views/sales/SaleFormView.vue';
import SaleDetailView from '../../views/sales/SaleListView.vue';

const saleRoutes: Array<RouteRecordRaw> = [
  {
    path: '/sales',
    name: 'sales',
    component: SaleListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/sales/new',
    name: 'sale-create',
    component: () => SaleFormView,
    meta: { requiresAuth: true }
  },
  {
    path: '/sales/:id',
    name: 'sale-detail',
    component: () => SaleDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/sales/:id/edit',
    name: 'sale-edit',
    component: () => SaleFormView,
    meta: { requiresAuth: true, roles: ['admin_seller'] }
  }
];

export default saleRoutes;