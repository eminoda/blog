<template>
  <div :class="fullPage ? 'full-layout-wrap' : 'content-layout-wrap'">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    fullPage: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.content-layout-wrap {
  background-color: #fff;
  width: 1000px;
  padding: 30px;
  margin: 20px auto;
}
.full-layout-wrap {
  background: #fff;
  padding: 30px;
}
</style>