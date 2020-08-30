'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {
  async userLogin() {
    const { ctx, service } = this;
    const userQuery = ctx.request.body;
    const user = await ctx.model.User.findOne({ userName: userQuery.userName, password: userQuery.password });
    if (!user) {
      throw new Error('用户不存在');
    }
    ctx.body = {
      success: true,
      data: user,
    };
  }
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
