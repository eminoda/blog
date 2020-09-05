'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.post('/api/user/login', controller.user.login);

  router.get('/api/posts', app.middleware.jwtToken, controller.post.list);
  router.get('/api/posts/:id', controller.post.detail);
  router.get('/api/posts/:id/markdown', controller.post.getMarkFile);

  // 爬取文章
  router.get('/admin/spider/posts/', app.middleware.jwtToken, controller.spider.posts);
  router.get('/admin/spider/posts/:id', app.middleware.jwtToken, controller.spider.post);
  // 解析文章属性
  router.post('/api/admin/parse/postProps', app.middleware.jwtToken, controller.admin.parsePostProps);
  // 保存文章修改
  router.post('/api/admin/save/postMarkdown', app.middleware.jwtToken, controller.admin.savePost);

  // 静态页面
  router.get('*', app.middleware.jwtToken, app.middleware.ssrRender(app));
};
