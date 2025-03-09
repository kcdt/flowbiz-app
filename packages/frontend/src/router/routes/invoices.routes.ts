import { RouteRecordRaw } from 'vue-router';
import InvoiceListView from '../../views/invoices/InvoiceListView.vue';
import InvoiceDetailView from '../../views/invoices/InvoiceDetailView.vue';

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