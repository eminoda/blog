const koaStatic = require('koa-static');
const path = require('path');
module.exports = () => {
  return koaStatic(path.join(__dirname, '../../dist'));
};
