const jwt = require('jsonwebtoken');

// 解析 jwtToken
module.exports = async (ctx, next) => {
  const token = ctx.cookies.get('token');
  ctx.state.userLoginStatus = {
    code: 200,
    message: '',
  };
  if (token) {
    try {
      const decoded = jwt.verify(token, 'eminoda_key');
      const user = await ctx.model.User.findOne({ userName: decoded.name });
      if (user) {
        ctx.state.user = user;
        await next();
      } else {
        ctx.state.userLoginStatus.code = 500; //Forbidden
        ctx.state.userLoginStatus.message = '用户不存在';
      }
    } catch (err) {
      ctx.state.userLoginStatus.code = 403; //Unauthorized
      ctx.state.userLoginStatus.message = '登录状态失效，请先登录';
    }
  } else {
    ctx.state.userLoginStatus.code = 403; //Forbidden
    ctx.state.userLoginStatus.message = '用户未登录，请先登录';
  }
};
