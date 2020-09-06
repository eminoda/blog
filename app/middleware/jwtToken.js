const jwt = require('jsonwebtoken');

// 解析 jwtToken
module.exports = async (ctx, next) => {
  const isHtml = function isHtml(message) {
    return 'html' == ctx.accepts('html');
  };
  const isForceLogin = function(url) {
    return ctx.path.indexOf(url) == -1;
  };
  const redirectLoginUrl = function(url) {
    return '/user/login?backUrl=' + encodeURIComponent(url || ctx.path);
  };
  // 非验证链接
  if (isForceLogin('/admin') || !isForceLogin('/user/login')) {
    await next();
  } else {
    const token = ctx.cookies.get('token');
    if (!token) {
      if (isHtml()) {
        ctx.redirect(redirectLoginUrl());
      } else {
        throw new Error('用户未登录，请先登录');
      }
    } else {
      // 解析 token
      try {
        const decoded = jwt.verify(token, 'eminoda_key');
        const user = await ctx.model.User.findOne({ userName: decoded.name });
        if (user) {
          ctx.state.user = user;
          await next();
        } else {
          throw new Error('用户不存在');
        }
      } catch (err) {
        if (isHtml()) {
          ctx.redirect(redirectLoginUrl());
        } else {
          throw new Error('登录状态失效，请先登录');
        }
      }
    }
  }
};
