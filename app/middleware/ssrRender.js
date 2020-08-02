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

const readFileInDist = function (file) {
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

let template = fs.readFileSync(path.join(__dirname, '../../src/index.template.html'), 'utf-8');

module.exports = () => {
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
  return async function (ctx, next) {
    // await next();
    // TODO: env 判断
    // const bundle = JSON.parse(readFileInDist('vue-ssr-server-bundle.json'));
    // const clientManifest = JSON.parse(readFileInDist('vue-ssr-client-manifest.json'));
    // const template = fs.readFileSync(path.join(__dirname, '../../src/index.template.html'), 'utf-8');

    const { clientManifest, bundle } = await readyPromise;
    // TODO: 动态配置
    const context = {
      title: 'Vue HN 2.0',
      url: ctx.path,
    };
    try {
      ctx.body = await ssrRender({ bundle, template, clientManifest, context });
    } catch (err) {
      // prod 不需要判断
      if (err.code == 404) {
        if (ctx.path == '/__webpack_hmr') {
          console.log('__webpack_hmr');
          await webpackHotMiddlewareWrap(ctx, clientCompiler, { heartbeat: 5000 });
        } else {
          await devMiddlewareWrap(ctx);
        }
      } else {
        await next();
      }
    }
  };
};

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

function webpackHotMiddlewareWrap(ctx, compiler, opts) {
  let stream = new PassThrough();
  ctx.body = stream;
  return webpackHotMiddleware(compiler, opts)(
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
        // ctx.res.end();
        ctx.body = '';
      },
    },
    () => {}
  );
}
