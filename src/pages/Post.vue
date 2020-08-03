<template>
  <content-layout>
    <div class="markdown-body">
      <h2 id="动态路由">动态路由</h2>
      <p>
        即使不是 SSR 服务端渲染，SPA
        也可以通过权限的控制，以动态路由的方式实现。
      </p>
      <p>
        比如当前页面，你无法从以往约定的 router
        结构中找到，路由结构将通过后端接口解析生成。
      </p>
      <p><strong>怎么做呢？</strong></p>
      <p>
        每次路由跳转时，通过 beforeEach 路由拦截，请求后端获取当前 user
        的路由权限，并加入到 vue 的 router 结构中，形成新的路由体系：
      </p>
      <pre>
        <code class="language-js">// 路由拦截
router.beforeEach((to, from, next) => {
  const _vue = router.app;
  fetchDynamicRoutes()
    .then((dynamicRoutes) => {
      // 组装新路由
      const routes = helper.generatorRoutes(dynamicRoutes);
      _vue.$router.addRoutes(routes);
      next();
    })
    .catch((err) => {});
});</code>
      </pre>
    </div>
  </content-layout>
</template>

<script>
import ContentLayout from '../components/layout/ContentLayout'
export default {
  components: { ContentLayout }
}
</script>

<style lang="scss" scoped>
.markdown-body {
  word-break: break-word;
  line-height: 1.75;
  font-weight: 400;
  font-size: 15px;
  color: #333;
  h2 {
    padding-bottom: 12px;
    font-size: 24px;
    border-bottom: 1px solid #ececec;
  }
  p {
    line-height: inherit;
    margin-top: 22px;
    margin-bottom: 22px;
  }
  strong {
    background-color: #fff5f5;
    color: #ff502c;
    font-size: 0.87em;
    padding: 0.065em 0.4em;
  }
  pre {
    line-height: 0;
    overflow: hidden;
    code {
      line-height: 1.75;
      display: block;
      padding: 18px 15px 12px;
      color: #333;
      background: #f8f8f8;
      overflow: auto;
    }
  }
}
</style>