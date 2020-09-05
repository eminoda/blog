import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './pages/Home.vue';
import Post from './pages/Post.vue';
import User from './pages/User.vue';
import UserLogin from './pages/user/Login.vue';

import AdminPostList from './pages/admin/PostList.vue';
import AdminPostDetail from './pages/admin/PostDetail.vue';

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
  {
    path: '/admin/posts',
    component: AdminPostList,
  },
  {
    path: '/admin/posts/:id',
    component: AdminPostDetail,
  },
  {
    path: '/user/login',
    component: UserLogin,
  },
];

const router = new VueRouter({ mode: 'history', routes });

export default router;
