<template>
  <content-layout>
    <h2>{{ post.title }}</h2>
    <div class="markdown-body" v-html="postHtml"></div>
  </content-layout>
</template>

<script>
import Http from '../utils/Http.js';
import ContentLayout from '../components/layout/ContentLayout';
import marked from 'marked'
export default {
  components: { ContentLayout },
  asyncData({ store, route }) {
    return store.dispatch('fetchPost', route.params.id)
  },
  data() {
    return {
      post: this.$store.state.post || {},
      postHtml: this.$store.state.postHtml || ''
    };
  },
  // mounted() {
  //   const self = this;
  //   new Http()
  //     .request({
  //       url: `/posts/${this.$route.params.id}`,
  //     })
  //     .then((data) => {
  //       self.post = data;
  //       self.postHtml = marked(data.markdown)
  //     })
  //     .catch((err) => { });
  // },
};
</script>

<style lang="scss" scoped></style>
