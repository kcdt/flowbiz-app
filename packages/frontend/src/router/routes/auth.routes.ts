import { RouteRecordRaw } from 'vue-router';
import LoginView from '../../views/auth/LoginView.vue';
import RegisterView from '../../views/auth/RegisterView.vue';

const authRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresAuth: false }
  }
];

export default authRoutes;