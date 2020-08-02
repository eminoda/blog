<template>
  <div class="wrap">
    <posts />
    <div>
      <router-link to="/user">user </router-link>
    </div>
  </div>
</template>

<script>
import Posts from '../components/post/Posts'
export default {
  components: { Posts }
}
</script>

<style lang="scss" scoped>
.wrap {
  width: 1000px;
  margin: 30px auto;
}
</style>