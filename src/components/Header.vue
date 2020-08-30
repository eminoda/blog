<template>
  <a-layout-header>
    <div class="header">
      <div class="logo">NextInnovation</div>
      <a-menu
        class="menu-wrap"
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['2']"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item v-for="item in menus" :key="item.id">{{
          item.name
        }}</a-menu-item>
      </a-menu>
    </div>
  </a-layout-header>
</template>

<script>
export default {
  data() {
    return {
      menus: [
        { id: 1, name: '首页' },
        { id: 2, name: '标签' },
        { id: 3, name: '分类' },
        { id: 4, name: '归档' },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.ant-layout-header {
  position: fixed;
  width: 100%;
  z-index: 999;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 1000px;
    margin: auto;
    .logo {
      background-color: #fff;
      color: #333;
      font-size: 20px;
      padding: 0 10px;
    }
    .menu-wrap {
      width: 100%;
      text-align: center;
    }
  }
}
</style>