const Service = require('egg').Service;
const moment = require('moment');

class ParserService extends Service {
  async parsePostProps(id) {
    const { ctx, service } = this;
    const post = await ctx.model.Post.findById(id);
    if (!post) {
      throw new Error('文章不存在');
    }
    if (!post.raw) {
      throw new Error('文章源地址不存在');
    }
    const originMarkdown = await service.spider._fetch(post.raw);
    await service.post.updatePostById(id, { originMarkdown });

    const { title, tags, categories, date } = service.spider.parsePostProps(originMarkdown);
    await service.post.updatePostById(id, { title, tags, categories, publishTime: date ? moment(date, 'YYYY-MM-DD HH:mm:ss') : null });
  }
}

module.exports = ParserService;
