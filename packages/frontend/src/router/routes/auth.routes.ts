import { RouteRecordRaw } from 'vue-router';

const LoginView = () => import('../../views/auth/LoginView.vue')
const RegisterView = () => import('../../views/auth/RegisterView.vue')

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