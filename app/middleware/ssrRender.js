const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const PassThrough = require('stream').PassThrough;
const MFS = require('memory-fs');
const fs = require('fs');
const path = require('path');
const { createBundleRenderer } = require('vue-server-renderer');
const clientConfig = require('../../build/client');
const serverConfig = require('../../build/server');

const readFileInDist = function(file) {
  return fs.readFileSync(path.join(__dirname, '../../dist', file), 'utf-8');
};
const readFileByWebpackOutputPath = (fs, file) => {
  return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8');
};

clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app];
clientConfig.output.filename = '[name].js';
clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin());

const clientCompiler = webpack(clientConfig);
const devMiddleware = webpackDevMiddleware(clientCompiler, {
  publicPath: clientConfig.output.publicPath,
  noInfo: true,
});

const serverCompiler = webpack(serverConfig);
const mfs = new MFS();
serverCompiler.outputFileSystem = mfs;

module.exports = (options, config) => {
  let template;
  let clientManifest;
  let bundle;
  let ready;
  const readyPromise = new Promise((r) => {
    ready = r;
  });

  const update = () => {
    if (bundle && clientManifest) {
      ready({ clientManifest, bundle });
    }
  };

  if (config.env == 'local') {
    template = fs.readFileSync(path.join(__dirname, '../../src/index.template.html'), 'utf-8');
    clientCompiler.plugin('done', (stats) => {
      stats = stats.toJson();
      stats.errors.forEach((err) => console.error(err));
      stats.warnings.forEach((err) => console.warn(err));
      if (stats.errors.length) return;
      clientManifest = JSON.parse(readFileByWebpackOutputPath(devMiddleware.fileSystem, 'vue-ssr-client-manifest.json'));
      update();
    });
    serverCompiler.watch({}, (err, stats) => {
      if (err) throw err;
      stats = stats.toJson();
      if (stats.errors.length) return;
      bundle = JSON.parse(readFileByWebpackOutputPath(mfs, 'vue-ssr-server-bundle.json'));
      update();
    });
  } else {
    bundle = JSON.parse(readFileInDist('vue-ssr-server-bundle.json'));
    clientManifest = JSON.parse(readFileInDist('vue-ssr-client-manifest.json'));
    template = fs.readFileSync(path.join(__dirname, '../../src/index.template.html'), 'utf-8');
  }

  return async function(ctx, next) {
    const { clientManifest, bundle } = await readyPromise;
    const context = {
      title: options.title,
      url: ctx.path,
    };
    try {
      ctx.body = await ssrRender({ bundle, template, clientManifest, context });
    } catch (err) {
      if (config.env == 'prod') {
        await next();
      } else {
        if (err.code == 404) {
          if (ctx.path == '/__webpack_hmr') {
            webpackHotMiddlewareWrap(ctx, clientCompiler, { heartbeat: 5000 });
          } else {
            await devMiddlewareWrap(ctx);
            await next();
          }
        } else {
          throw err;
        }
      }
    }
  };
};

/**
 * ssr 渲染方法
 * 参考：[bundle renderer 指引](https://ssr.vuejs.org/zh/guide/bundle-renderer.html)
 *
 */
function ssrRender({ template, clientManifest, bundle, context }) {
  return new Promise((resolve, reject) => {
    try {
      const renderer = createBundleRenderer(bundle, {
        template,
        clientManifest,
      });

      renderer.renderToString(context, (err, html) => {
        if (!err) {
          resolve(html);
        } else {
          reject(err);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 通过 webpack-dev-middleware 中间件，在开发环境中返回内存中客户端的资源文件
 */
function devMiddlewareWrap(ctx) {
  return new Promise((resolve, reject) => {
    devMiddleware(
      ctx.req,
      {
        end: (content) => {
          ctx.body = content;
          resolve(true);
        },
        getHeader: ctx.get.bind(ctx),
        setHeader: ctx.set.bind(ctx),
        locals: ctx.state,
      },
      () => {}
    );
  });
}

/**
 * 通过 webpack-hot-middleware 中间件解析 socket 热更新请求
 */
function webpackHotMiddlewareWrap(ctx, compiler, opts) {
  let stream = new PassThrough();
  ctx.body = stream;
  webpackHotMiddleware(compiler, opts)(
    ctx.req,
    {
      write: stream.write.bind(stream),
      // 如果以后有坑，就请注意：不建议直接使用 ctx.res 原生 response 方法，这样就跳过 koa 的处理了。https://koa.bootcss.com/#ctx-res
      // write: data => {
      //   ctx.res.write(data);
      // },
      writeHead: (status, headers) => {
        ctx.status = status;
        ctx.set(headers);
      },
      end: () => {
        ctx.res.end();
        // ctx.body = '';
      },
    },
    () => {}
  );
}
