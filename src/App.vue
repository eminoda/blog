<template>
  <div id="app">
    <a-layout class="wrap">
      <Header />
      <a-layout-content>
        <router-view class="view"></router-view>
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
<style>
.wrap {
  background-color: #f4f5f5;
  margin: auto;
}
</style>