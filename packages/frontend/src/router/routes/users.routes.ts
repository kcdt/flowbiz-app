import { RouteRecordRaw } from 'vue-router';
import UserView from '../../views/user/UserView.vue';

const usersRoutes: Array<RouteRecordRaw> = [
  {
    path: '/user',
    name: 'user',
    component: UserView,
    meta: { requiresAuth: true }
  }
];

export default usersRoutes;