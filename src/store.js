import Vue from 'vue';
import Vuex from 'vuex';

import api from './services/http.js';

Vue.use(Vuex);

const vueStore = new Vuex.Store({
  state: {
    items: {},
    name: '',
  },
  actions: {
    fetchItem({ commit }, option) {
      return api(option).then((data) => {
        commit('setData', { time: data });
      });
    },
  },
  mutations: {
    setData(state, data) {
      // Vue.set(state.items, id, data);
      state.items = data;
    },
    setName(state, data) {
      state.name = data;
    },
  },
});

export default vueStore;
