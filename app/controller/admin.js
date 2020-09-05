'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {
  async parsePostProps() {
    const { ctx, service } = this;
    const id = ctx.request.body.id;
    if (!id) {
      throw new Error('参数非法');
    }
    await service.parser.parsePostProps(id);
    ctx.body = {
      success: true,
    };
  }

  async savePost() {
    const { ctx, service } = this;
    const id = ctx.request.body.id;
    if (!id) {
      throw new Error('参数非法');
    }
    const post = await service.post.getPostById(id);
    if (!post) {
      throw new Error('文章不存在');
    } else {
      await service.post.updatePost({
        _id: id,
        markdown: ctx.request.body.markdown,
        title: ctx.request.body.title,
      });
    }
    ctx.body = {
      success: true,
      data: await service.post.getPostById(id),
    };
  }
}

module.exports = AdminController;
