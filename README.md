# blog

eminoda 的博客

# TODO LIST

- [ ] 搭建项目框架

  - [x] 使用 egg-init 初始化基础框架
  - [x] 添加 vue ssr 基础功能
    - [x] 准备 webpack 构建文件，针对 server 和 client
    - [x] 集成 webpack-dev-middleware 中间件
    - [x] 集成 webpack-hot-middleware 中间件
    - [ ] router 和 store 的解析
  - [ ] mongodb 数据存储

- [ ] 页面设计

  - [x] 集成 antd
  - [x] 文章列表页
  - [x] 文章详情页

- [ ] 博客搬迁

  - [ ] 爬取文章列表，存储文章基础数据 /admin/spider/posts
  - [ ] 根据 post.id 存储文章（单个/批量） /admin/transfer/posts/:name
    - [ ] 查询文章内容 getPostByName
    - [ ] 解析 tag，category 内容 parseKeyWord
    - [ ] 解析资源地址，批量存储到服务器 parseAssertImage saveAssertImage
    - [ ] 存储 md 源文件 saveOriginMD
    - [ ] 更新发布时间 updatePostById

- [ ] 在线编辑
