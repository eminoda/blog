import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './pages/Home.vue';
import User from './pages/User.vue';

Vue.use(VueRouter);
const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/user',
    component: User,
  },
];

const router = new VueRouter({ mode: 'history', routes });

export default router;
