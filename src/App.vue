<template>
  <div id="app">
    <a-layout>
      <Header />
      <a-layout-content>
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
import Header from './components/Header'
export default {
  name: 'App',
  components: { Header }
}
</script>
<style lang="scss" scoped>
.ant-layout {
  background-color: #f4f5f5;
  margin: auto;
  .ant-layout-content {
    margin-top: 64px;
  }
}
</style>