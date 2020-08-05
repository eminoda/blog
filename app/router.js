'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.get('/admin/parser/posts/', controller.parser.posts);
  router.get('/admin/parser/posts/:name', controller.parser.post);
};
