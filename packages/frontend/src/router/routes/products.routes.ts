import { RouteRecordRaw } from 'vue-router';
import ProductListView from '../../views/products/ProductListView.vue';
import ProductFormView from '../../views/products/ProductFormView.vue';
import ProductDetailView from '../../views/products/ProductDetailView.vue';

const productRoutes: Array<RouteRecordRaw> = [
  {
    path: '/products',
    name: 'products',
    component: () => ProductListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/products/new',
    name: 'product-create',
    component: () => ProductFormView,
    meta: { requiresAuth: true }
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: () => ProductDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/products/:id/edit',
    name: 'product-edit',
    component: () => ProductFormView,
    meta: { requiresAuth: true }
  }
];

export default productRoutes;