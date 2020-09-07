import { createApp } from './app';

const defaultTDK = {
  title: '前端雨爸 Eminoda 的博客',
  keywords: '前端,前端雨爸,Eminoda,前端工程师,Javascript,js,node.js,vue.js',
  description: '分享前端技术',
};

const trimLine = function(data) {
  if (data) {
    return data.replace(/[\s#]+/g, ' ').substring(0, 150);
  }
  return data;
};
export default (context) => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();
    router.push(context.path);
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      if (!matchedComponents.length) {
        return reject({ code: 404, url: context.path });
      }
      Promise.all(
        matchedComponents.map((Component) => {
          if (Component.asyncData) {
            return Component.asyncData({
              store,
              route: router.currentRoute,
            });
          }
        })
      )
        .then(() => {
          // 在所有预取钩子(preFetch hook) resolve 后，
          // 我们的 store 现在已经填充入渲染应用程序所需的状态。
          // 当我们将状态附加到上下文，
          // 并且 `template` 选项用于 renderer 时，
          // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
          const post = store.state.post || {};
          context.title = post.title || defaultTDK.title;
          context.meta = context.meta = `
              <meta name="keywords" content="${post.tags ? post.tags.join('') : defaultTDK.keywords}">
              <meta name="description" content="${post.markdown ? trimLine(post.markdown) : defaultTDK.description}">
            `;
          context.state = store.state;
          resolve(app);
        })
        .catch(reject);
      // resolve(app);
    }, reject);
  });
};
