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
  async detail() {
    const { ctx, service } = this;
    const id = ctx.params.id;
    if (!id) {
      throw new Error('参数错误：文章 id 不存在');
    }
    const post = await service.post.getPostById(id);
    post.markdown = post.markdown.replace(/-{3}(?:[\.\-:：()（），、——\[\]“”''""\$&\w\s\t\u4e00-\u9fa5]+)-{3}/, '');
    if (!post) {
      throw new Error('文章不存在');
    } else {
      ctx.body = {
        data: post,
      };
    }
  }

  async getMarkFile() {
    const { ctx, service } = this;
    const id = ctx.params.id;
    if (!id) {
      throw new Error('文章不存在');
    }
    const post = await service.post.getPostById(id);
    if (!post.originMarkdown) {
      throw new Error('源文章不存在');
    }
    if (!post.markdown) {
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
      try {
        const markdown = service.spider._replaceMdData(post.originMarkdown, assets);
        if (markdown) {
          await ctx.model.Post.updateOne({ _id: id }, { markdown });
        }
        ctx.body = {
          data: marked(markdown),
        };
      } catch (err) {
        throw new Error('markdown 解析错误');
      }
    } else {
      ctx.body = {
        data: marked(post.markdown),
      };
    }
  }
}

module.exports = PostController;
