const Service = require('egg').Service;

class PostService extends Service {
  async getPosts(page = 1, pageSize = 10) {
    const { ctx, service } = this;
    return ctx.model.Post.find({})
      .sort({ publishTime: 'desc' })
      .skip(Number((page - 1) * pageSize))
      .limit(Number(pageSize));
  }
  async getPostById(id) {
    const { ctx, service } = this;
    return ctx.model.Post.findById(id);
  }
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
      return ctx.model.Post.create(post);
    }
  }
  async findPostByUrl(url) {
    const { ctx, service } = this;
    return ctx.model.Post.findOne({ url });
  }
  async updatePostById(id, data) {
    const { ctx, service } = this;
    return ctx.model.Post.updateOne({ _id: id }, data);
  }

  async checkExistAndSaveAssetImg(assetImgs, { _id, fileName }) {
    const { ctx, service } = this;
    const promiseList = [];
    const prefixPath = 'https://raw.githubusercontent.com/eminoda/myBlog/master/eminoda.github.io/source/_posts';
    for (let item of assetImgs) {
      const promiseFn = new Promise((resolve, reject) => {
        try {
          ctx.model.Asset.findOne({ fileName: item.fileName })
            .then((data) => {
              if (!data) {
                const asset = {
                  fileName: item.fileName,
                  desc: item.desc,
                  postId: _id,
                  originUrl: `${prefixPath}/${fileName.split('.')[0]}/${item.fileName}`,
                };
                return ctx.model.Asset.create(asset);
              } else {
                resolve(true);
              }
            })
            .then((data) => {
              resolve(true);
            })
            .catch((err) => {
              reject(err);
            });
        } catch (err) {
          reject(err);
        }
      });
      promiseList.push(promiseFn);
    }
    return Promise.all(promiseList);
  }
}

module.exports = PostService;
