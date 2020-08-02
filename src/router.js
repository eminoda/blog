import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './pages/Home.vue';
import Post from './pages/Post.vue';
import User from './pages/User.vue';

Vue.use(VueRouter);
const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/post/:id',
    component: Post,
  },
  {
    path: '/user',
    component: User,
  },
];

const router = new VueRouter({ mode: 'history', routes });

export default router;
