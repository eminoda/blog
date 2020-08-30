import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './pages/Home.vue';
import Post from './pages/Post.vue';
import User from './pages/User.vue';
import AdminPostList from './pages/admin/PostList.vue';
import AdminPostDetail from './pages/admin/PostDetail.vue';
import AdminUserLogin from './pages/admin/Login.vue';

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
    path: '/admin/user/login',
    component: AdminUserLogin,
  },
];

const router = new VueRouter({ mode: 'history', routes });

export default router;
