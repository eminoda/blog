'use strict';

const Controller = require('egg').Controller;

class ParserController extends Controller {
  // 解析文章列表
  async posts() {
    const { ctx, service } = this;
    ctx.body = await service.spider.getPosts();
  }
  async post() {
    const { ctx, service } = this;
    ctx.body = await service.spider.getPost(ctx.params.name);
  }
}

module.exports = ParserController;
