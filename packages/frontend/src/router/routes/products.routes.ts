import { RouteRecordRaw } from 'vue-router';

const ProductListView = () => import('../../views/products/ProductListView.vue')

const productRoutes: Array<RouteRecordRaw> = [
  {
    path: '/products',
    name: 'products',
    component: ProductListView,
    meta: { requiresAuth: true }
  }
];

export default productRoutes;