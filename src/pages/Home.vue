<template>
  <content-layout>
    <posts />
  </content-layout>
</template>

<script>
import Posts from '../components/post/Posts'
import ContentLayout from '../components/layout/ContentLayout'
export default {
  components: { ContentLayout, Posts },
  asyncData({ store, route }) {
    return store.dispatch('fetchPosts','test')
  },
  mounted(){
    console.log(this.$store.state.posts)
  }
}
</script>

<style lang="scss" scoped>
</style>