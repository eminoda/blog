import Vue from 'vue';
import router from './router';
// import store from './store.js';
import App from './App.vue';
import Antd from 'ant-design-vue';
import './filters';

import 'ant-design-vue/dist/antd.css';
import './style/markdown.scss';

Vue.use(Antd);
export function createApp() {
	//   额外导出 router ，供 ssr 使用
	const app = new Vue({ router, render: (h) => h(App) });
	return { app, router };
	// return { app, router, store };
}
