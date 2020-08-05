const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const Service = require('egg').Service;
const Http = require('../util/http');
class SpiderService extends Service {
  async getPosts() {
    const url = 'https://github.com/eminoda/myBlog/tree/master/eminoda.github.io/source/_posts';
    try {
      // const data = await new Http().request({ url });
      const { ctx } = this;
      const data = require('./data');
      const $ = cheerio.load(data);
      const $list = $('.mr-3.flex-shrink-0[role="gridcell"]').siblings('[role="rowheader"]');

      const promisePosts = [];
      $list.each(function() {
        const $href = $(this).find('a');
        const name = $href.text();
        const url = `https://www.github.com${$href.attr('href')}`;
        const raw = `https://raw.githubusercontent.com${$href.attr('href')}.md`.replace('tree/', '');
        promisePosts.push(
          ctx.model.Post.create({
            name,
            url,
            raw,
          })
        );
      });
      const result = await Promise.all(promisePosts);
      return {
        data: result,
      };
    } catch (err) {
      throw err;
    }
  }
  async getPost(name) {
    const { ctx } = this;
    const post = await ctx.model.Post.findOne({
      name,
    });
    if (!post) {
      throw new Error('文章不存在');
    }
    const data = await new Http().request({ url: post.raw });
    const dirtory = `${path.join(__dirname, '../../posts')}`;
    try {
      if (!fs.existsSync(dirtory)) {
        fs.mkdirSync(dirtory);
      }
      fs.writeFileSync(`${dirtory}/${name}.md`, data, {
        encoding: 'utf8',
      });
    } catch (err) {
      throw new Error('存储失败');
    }
    return {
      data: dirtory,
    };
  }
}

module.exports = SpiderService;
