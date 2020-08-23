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
  - [x] mongodb 数据存储
  - [x] 集成 AntiDesign UI

- [ ] 页面设计

  - [ ] 文章列表页
  - [ ] 文章详情页
  - [ ] 后台 admin
    - [ ] 文章列表页
      - [ ] 文章展示
      - [ ] 文章发布
      - [ ] 文章标题检查
      - [ ] 资源文件检查
      - [ ] 标签、分类检查
    - [ ] 文章详情页
      - [ ] 预览
      - [ ] 编辑
    - [ ] 在线编辑

- [ ] 博客搬迁

  - [*] 爬取文章列表，解析基础数据 /admin/spider/posts/
  - [ ] 根据 post.id 爬取指定文章 /admin/spider/posts/:id

    - [*] 解析（图片）资源地址，批量存储到服务器
    - [*] 替换 markdown 图片地址（asset_img 为 raw.github 地址）
    - [*] 存储 md 源文件 saveOriginMD
    - [ ] 解析 tag，category 内容 parseKeyWord

    * [ ] 数据修复
      - [ ] 检查文章内，图片资源数==asset_img 数量==assetByPostId count
      - [ ] 检查文章图片未显示问题（markdown 缩进问题）
        - [ ] .replace(/(.\*)(\n\s+!\[)/g,'$1\n$2')
      - [ ] 更新检查状态 updatePostPublishStatus
