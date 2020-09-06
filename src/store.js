import Vue from 'vue';
import Vuex from 'vuex';
import Http from './utils/Http.js';

// import api from './services/http.js';

Vue.use(Vuex);

const vueStore = new Vuex.Store({
  state: {
    posts: [],
    postsTotalCount: 0,
  },
  actions: {
    fetchPosts({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        new Http()
          .request({
            url: '/posts',
            data: {
              page: 1,
              pageSize: 10,
            },
          })
          .then((data) => {
            commit('setPosts', { list: data.list, total: data.total });
            resolve(true);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
  mutations: {
    setPosts(state, { list, total }) {
      state.posts = list;
      state.postsTotalCount = total;
    },
  },
});

export default vueStore;
