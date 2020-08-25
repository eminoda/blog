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
}

module.exports = AdminController;
