<template>
  <a-list item-layout="horizontal" :data-source="data" class="list-wrap">
    <a-list-item slot="renderItem" slot-scope="item">
      <a-list-item-meta>
        <router-link slot="title" :to="{ path: '/post/123' }" class="title">{{
          item.title
        }}</router-link>
        <div slot="description">
          <div>
            <a-tag color="pink">
              vue
            </a-tag>
            <a-tag color="red">
              ssr
            </a-tag>
          </div>
          <div class="date">2020-8-3 00:53:10</div>
        </div>
      </a-list-item-meta>
      <img
        slot="extra"
        width="150"
        alt="logo"
        src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
      />
    </a-list-item>
  </a-list>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          title: 'vue 源码学习-数据动态响应：依赖 Dep',
        },
        {
          title: 'js 基础：对象属性 property 相关 api 示例',
        },
        {
          title: 'css 中 BFC 规范',
        },
        {
          title: 'vue 源码学习-数据动态响应：监听者 Watcher',
        },
      ],
    };
  },
}
</script>

<style scoped lang="scss">
.list-wrap {
  .ant-list-item-meta-title {
    font-size: 20px;
    margin-bottom: 15px;
  }
  .date {
    margin-top: 5px;
    font-size: 14px;
  }
}
</style>