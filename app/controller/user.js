const Controller = require('egg').Controller;

class UserControlller extends Controller {
  async login() {
    const { ctx, service } = this;
    const userQuery = ctx.request.body;
    const user = await ctx.model.User.findOne({ userName: userQuery.userName, password: userQuery.password });
    if (!user) {
      throw new Error('用户不存在');
    }
    ctx.cookies.set(
      'token',
      service.user.setToken({
        name: user.userName,
      })
    );
    ctx.body = {
      success: true,
      data: user,
    };
  }
}
module.exports = UserControlller;
