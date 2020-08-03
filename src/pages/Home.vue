<template>
  <content-layout>
    <posts />
    <div>
      <router-link to="/user">user </router-link>
    </div>
  </content-layout>
</template>

<script>
import Posts from '../components/post/Posts'
import ContentLayout from '../components/layout/ContentLayout'
export default {
  components: { ContentLayout, Posts }
}
</script>

<style lang="scss" scoped>
</style>