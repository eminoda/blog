'use strict';

const Controller = require('egg').Controller;

class ParserController extends Controller {
  /**
   * response
   * data:[{
   *  "tags": [],
   *  "category": [],
   *  "_id": "5f33254e24bc9d2e2888a433",
   *  "name": "2017-01-23-hello-world.md",
   *  "url": "https://www.github.com/eminoda/myBlog/blob/master/eminoda.github.io/source/_posts/2017-01-23-hello-world.md",
   *  "raw": "https://raw.githubusercontent.com/eminoda/myBlog/master/eminoda.github.io/source/_posts/2017-01-23-hello-world.md",
   *  "createTime": "2020-08-11T23:10:06.375Z",
   *  "__v": 0
   */
  async posts() {
    const { ctx, service } = this;
    ctx.body = await service.spider.parsePosts();
  }
  // 5f36b3838817ff22b8e309e3
  async post() {
    const { ctx, service } = this;
    const postId = ctx.params.id;
    ctx.body = await service.spider.parsePost(postId);
  }
}

module.exports = ParserController;
