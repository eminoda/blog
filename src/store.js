import Vue from 'vue';
import Vuex from 'vuex';
import Http from './utils/Http.js';
import marked from 'marked';

// import api from './services/http.js';

Vue.use(Vuex);

const vueStore = new Vuex.Store({
  state: {
    posts: [],
    postsTotalCount: 0,
    post: {},
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
    fetchPost({ commit, state }, id) {
      return new Promise((resolve, reject) => {
        new Http()
          .request({
            url: `/posts/${id}`,
          })
          .then((data) => {
            commit('setPost', data);
            commit('setPostHtml', marked(data.markdown));
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
    setPost(state, post) {
      state.post = post;
    },
    setPostHtml(state, html) {
      state.postHtml = html;
    },
  },
});

export default vueStore;
