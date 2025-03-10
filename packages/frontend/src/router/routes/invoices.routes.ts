import { RouteRecordRaw } from 'vue-router';

const InvoiceListView = () => import('../../views/invoices/InvoiceListView.vue')
const InvoiceDetailView = () => import('../../views/invoices/InvoiceDetailView.vue')

const invoiceRoutes: Array<RouteRecordRaw> = [
  {
    path: '/invoices',
    name: 'invoices',
    component: InvoiceListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices/:id',
    name: 'invoice-detail',
    component: InvoiceDetailView,
    meta: { requiresAuth: true }
  }
];

export default invoiceRoutes;