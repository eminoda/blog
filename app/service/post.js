const Service = require('egg').Service;

class PostService extends Service {
  async addPosts(posts) {
    const { ctx, service } = this;
    const promisePosts = [];
    for (const post of posts) {
      promisePosts.push(service.post.addPost(post));
    }
    return Promise.all(promisePosts);
  }
  async addPost(post) {
    const { ctx, service } = this;
    const data = await service.post.findPostByUrl(post.url);
    if (data) {
      throw new Error(`已存在 ${post.url}`);
    } else {
      ctx.model.Post.create(post);
    }
  }
  async findPostByUrl(url) {
    const { ctx, service } = this;
    return ctx.model.Post.findOne({ url });
  }
  async updatePostById(id, data) {
    return ctx.model.Post.updateOne({ _id: id }, data);
  }

  async checkExistAndSaveAssetImg(assetImgs, { _id, name }) {
    const { ctx, service } = this;
    const promiseList = [];
    const prefixPath = 'https://raw.githubusercontent.com/eminoda/myBlog/master/eminoda.github.io/source/_posts';
    for (let item of assetImgs) {
      const data = await ctx.model.Asset.findOne({ fileName: item.fileName });
      if (!data) {
        const asset = {
          fileName: item.fileName,
          desc: item.desc,
          postId: _id,
          originUrl: `${prefixPath}/${name.split('.')[0]}/${item.fileName}`,
        };
        promiseList.push(ctx.model.Asset.create(asset));
      }
    }
    return promiseList;
  }
}

module.exports = PostService;
