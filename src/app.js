import Vue from 'vue';
import router from './router';
// import store from './store.js';
import App from './App.vue';

export function createApp() {
  //   额外导出 router ，供 ssr 使用
  const app = new Vue({ router, render: (h) => h(App) });
  return { app, router };
  // return { app, router, store };
}
