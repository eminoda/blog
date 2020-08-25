const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const Service = require('egg').Service;
const Http = require('../util/http');
const moment = require('moment');

class SpiderService extends Service {
  // 解析文章列表
  async parsePosts() {
    const { ctx, service } = this;
    // 1. 爬取页面内容
    const postsHtmlData = await service.spider._fetch('https://github.com/eminoda/myBlog/tree/master/eminoda.github.io/source/_posts');
    // 2. 解析文章列表数据
    const posts = service.spider._parsePostsHtmlData(postsHtmlData);
    // 3. 保存至数据库
    const result = await service.post.addPosts(posts);
    return {
      data: result,
    };
  }
  // 解析文章
  async parsePost(id) {
    const { ctx, service } = this;
    const post = await ctx.model.Post.findById(id);
    if (!post) {
      throw new Error('文章不存在');
    }

    if (post.markdown) {
      return post;
    }
    // 1. 获取，保存 md 源文件
    let originMarkdown = post.originMarkdown;
    if (!originMarkdown) {
      originMarkdown = await service.spider._fetch(post.raw);
      await service.post.updatePostById(id, { originMarkdown });
    }
    const assets = await ctx.model.Asset.find({ postId: id });
    if (!assets || assets.length == 0) {
      // 2. 解析 md 中的 asset_img 资源文件
      const assetImgs = service.spider.parseAssetImg(originMarkdown);
      // 3. 保存资源文件 asset，并关联 post
      await service.post.checkExistAndSaveAssetImg(assetImgs, post);
      // 4. 下载资源到本地
      await this.service.spider.downAssetImg(post);
    }

    if (!post.tags || post.tags.length == 0 || !post.categories || post.categories.length == 0) {
      const { title, tags, categories, date } = this.service.spider.parsePostProps(originMarkdown);
      await ctx.model.Post.updateOne({ _id: id }, { title, tags, categories, publishTime: moment(date, 'YYYY-MM-DD HH:mm:ss') });
    }

    // 替换 md 资源
    if (!post.markdown) {
      const markdown = service.spider._replaceMdData(originMarkdown, assets);
      if (markdown) {
        await ctx.model.Post.updateOne({ _id: id }, { markdown });
      }
    }

    const data = await ctx.model.Post.findById(id);
    return {
      data,
    };
  }

  async _fetch(url) {
    try {
      return new Http().request({ url });
    } catch (err) {
      throw new Error(`访问 github 列表页出错: ${err.message}`);
    }
  }

  _parsePostsHtmlData(data) {
    const posts = [];
    try {
      const $ = cheerio.load(data);
      const $list = $('.mr-3.flex-shrink-0[role="gridcell"]')
        .find('[color="gray-light"]')
        .parent()
        .siblings('[role="rowheader"]');

      $list.each(function() {
        const $href = $(this).find('a');
        const href = $href.attr('href');
        // https://github.com/eminoda/myBlog/blob/master/eminoda.github.io/source/_posts/2018-05-10-eslint-and-test.md
        // https://raw.githubusercontent.com/eminoda/myBlog/master/eminoda.github.io/source/_posts/2018-05-10-eslint-and-test.md
        posts.push({
          fileName: $href.text(),
          url: `https://www.github.com${href}`,
          raw: `https://raw.githubusercontent.com${href.replace('/blob', '')}`,
        });
      });
    } catch (err) {
      throw new Error(`解析 posts html 出错: ${err.message}`);
    }
    return posts;
  }

  _replaceMdData(mdData, assets) {
    const startIndex = mdData.indexOf('{% asset_img');
    if (startIndex !== -1) {
      let tempMdData = mdData.substring(startIndex);
      const endIndx = tempMdData.indexOf(' %}') + startIndex + 3;
      if (endIndx !== -1) {
        let template = mdData.substring(startIndex, endIndx);
        for (let { fileName, desc, originUrl } of assets) {
          if (template.indexOf(` ${fileName} ${desc ? desc + ' ' : ''}`) !== -1) {
            template = `![${desc}](${originUrl})`;
            mdData = mdData.substring(0, startIndex) + template + mdData.substring(endIndx);
            return this.service.spider._replaceMdData(mdData, assets);
          }
        }
        throw new Error('md 不正确');
      }
      throw new Error('md 不正确');
    } else {
      return mdData;
    }
  }

  async downAssetImg({ _id, fileName }) {
    const { ctx } = this;
    const assets = await ctx.model.Asset.find({ postId: _id });
    const promiseList = [];
    // 下载资源
    for (let asset of assets) {
      // https://raw.githubusercontent.com/eminoda/myBlog/master/eminoda.github.io/source/_posts/2017-02-09-git-quickstart/g7.png
      const fileNameMatch = asset.originUrl.match(/[^\/]+$/);
      const AssetImgfileName = fileNameMatch[0];
      const dirtory = `/posts/${fileName.split('.')[0]}`;
      const filePath = `${dirtory}/${AssetImgfileName}`;
      if (!fs.existsSync(filePath)) {
        // 2017-02-09-git-quickstart
        promiseList.push(this.service.spider.fetchAssetImg(asset, { dirtory }));
      }
    }
    // 关联 id
    let downList = await Promise.all(promiseList);
    const promiseUpdateList = [];
    for (let downResult of downList) {
      if (downResult.status) {
        promiseUpdateList.push(ctx.model.Asset.updateOne({ _id: downResult.id }, { downStatus: 1 }));
      }
    }
    return Promise.all(promiseUpdateList);
  }

  async fetchAssetImg({ _id, originUrl }, { dirtory }) {
    const fileNameMatch = originUrl.match(/[^\/]+$/);
    const assetImgFileName = fileNameMatch[0];
    return new Promise((resolve, reject) => {
      try {
        new Http({
          responseType: 'stream',
        })
          .request({ url: originUrl })
          .then((data) => {
            try {
              fs.mkdirSync(dirtory, { recursive: true });
            } catch (err) {
              throw new Error('fs 目录创建失败: ' + dirtory);
            }
            const ws = fs.createWriteStream(`${dirtory}/${assetImgFileName}`);
            data.pipe(ws);
            ws.on('finish', function() {
              resolve({ id: _id, status: true });
            });
            ws.on('error', function(err) {
              resolve({ id: _id, status: false, err });
            });
          })
          .catch((err) => {
            resolve({ id: _id, status: false, err });
          });
      } catch (err) {
        resolve({ id: _id, status: false, err });
      }
    });
  }

  parseAssetImg(data) {
    const list = [];
    const len = data.length;

    let index = 0;
    let template = data;
    let isFoundStart = false;
    let isFoundEnd = false;
    let moveIndex = 0;
    let startIndex = 0;
    let endIndex = 0;
    const assetImgLen = '% asset_img '.length;
    while (index < len) {
      if (!isFoundEnd && isFoundStart) {
        // 匹配结束标签
        const endIndexTmp = _matchTemplate(template, /%}/);
        if (endIndexTmp) {
          endIndex = endIndexTmp + moveIndex;
          const assetImg = data.substring(startIndex, endIndex - 1).split(' ');
          list.push({
            fileName: assetImg[0],
            desc: assetImg.length > 1 ? assetImg[1] : '',
            assetImgTemplate: `{% asset_img ${assetImg[0]} ${assetImg.length > 1 ? assetImg[1] : ''} %}`,
          });

          moveIndex = endIndex + '%}'.length;
          isFoundStart = false;
          isFoundEnd = false;
          template = data.substring(moveIndex);
          index = moveIndex;
        } else {
          break;
        }
      } else {
        // 判断资源链接开始部分
        const startIndexTmp = _matchTemplate(template, /{% asset_img/);
        if (!startIndexTmp) {
          break;
        } else {
          // 定义起始位置：标识开始位置+偏移量+ '{% asset_img '长度
          startIndex = startIndexTmp + moveIndex + assetImgLen + 1;
          isFoundStart = true;
        }
      }
      index++;
    }
    function _matchTemplate(template, re) {
      if (template) {
        const match = template.match(re);
        if (match) {
          return match.index;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    }
    return list;
  }

  parsePostProps(data) {
    const parseHeader = data.match(/^\n*-{3}([\.\-:：()（），、——\[\]“”''""\$&\w\s\u4e00-\u9fa5]+)-{3}/)[1];
    // console.log(parseHeader);
    var lineRe = /(\n+)([^\n]*)/g;
    var parse = {};
    var keyParse;
    while (1 == 1) {
      const lineResult = lineRe.exec(parseHeader);
      if (!lineResult || !lineResult[2]) {
        break;
      }
      const line = lineResult[2];
      const lineParse = /(title|tags|categories|thumb_img|date):\s+([^\n]*)/g.exec(line);
      // console.log(line);
      if (lineParse) {
        parse[lineParse[1]] = lineParse[2];
      } else {
        const mulitpleKey = /(tags|categories)/.exec(line);
        if (mulitpleKey) {
          keyParse = mulitpleKey[1];
          parse[keyParse] = [];
        } else {
          const mulitpleVal = /^\s+-\s*([^\n]*)/.exec(line);
          // console.log(mulitpleVal);
          if (mulitpleVal) {
            const valParse = mulitpleVal[1];
            parse[keyParse].push(valParse);
          }
        }
      }
    }
    parse.date = parse.date || null;
    parse.categories = parse.categories || [];
    parse.tags = parse.tags || [];
    parse.title = parse.title || '';
    return parse;
  }
}

module.exports = SpiderService;
