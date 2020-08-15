'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // 爬取文章
  router.get('/admin/spider/posts/', controller.spider.posts);
  router.get('/admin/spider/posts/:id', controller.spider.post);
};
