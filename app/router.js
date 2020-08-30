'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.get('/api/posts', controller.post.list);
  router.get('/api/posts/:id', controller.post.detail);
  router.get('/api/posts/:id/markdown', controller.post.getMarkFile);

  // 爬取文章
  router.get('/admin/spider/posts/', controller.spider.posts);
  router.get('/admin/spider/posts/:id', controller.spider.post);
  // 解析文章属性
  router.post('/api/admin/parse/postProps', controller.admin.parsePostProps);
  // 保存文章修改
  router.post('/api/admin/save/postMarkdown', controller.admin.savePost);
  router.post('/api/admin/user/login', controller.admin.userLogin);
};
