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

    // 解析文章属性
    const { title, tags, categories, date } = service.spider.parsePostProps(originMarkdown);

    let assets = await ctx.model.Asset.find({ postId: id });
    if (!assets || assets.length == 0) {
      try {
        // 2. 解析 md 中的 asset_img 资源文件
        const assetImgs = service.spider.parseAssetImg(post.originMarkdown);
        // 3. 保存资源文件 asset，并关联 post
        await service.post.checkExistAndSaveAssetImg(assetImgs, post);
        assets = await ctx.model.Asset.find({ postId: id });
      } catch (err) {
        throw new Error('关联文章资源错误');
      }
    }
    let markdown = post.markdown;
    try {
      if (!markdown) {
        markdown = service.spider._replaceMdData(post.originMarkdown, assets);
      }
    } catch (err) {
      throw new Error('markdown 解析错误');
    }

    await service.post.updatePostById(id, { markdown, title, tags, categories, publishTime: date ? moment(date, 'YYYY-MM-DD HH:mm:ss') : null });
  }
}

module.exports = ParserService;
