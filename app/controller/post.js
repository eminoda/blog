'use strict';

const Controller = require('egg').Controller;
const marked = require('marked');

class PostController extends Controller {
  async list() {
    const { ctx, service } = this;
    const total = await ctx.model.Post.countDocuments();
    const list = await service.post.getPosts(ctx.query.page, ctx.query.pageSize);
    ctx.body = {
      data: {
        list,
        total,
      },
    };
  }
  async marked() {
    const { ctx, service } = this;
    const post = await service.post.getPostById(ctx.params.id);
    ctx.body = {
      data: marked(post.markdown),
    };
  }
}

module.exports = PostController;
