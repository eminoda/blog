const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');

const webpackBaseConfig = require('./webpack.base');

const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

/**
 * webpack 服务端配置
 */
module.exports = merge(webpackBaseConfig, {
  target: 'node',
  // devtool: 'source-map',
  // 如果 output 设置 [name] 方式，则需要 entry 以对象方式表示
  entry: {
    server: './src/entry-server.js',
  },
  output: {
    // path: path.resolve(__dirname, '../dist_server'),
    filename: '[name].bundle.js',
    libraryTarget: 'commonjs2',
  },
  // https://webpack.js.org/configuration/externals/
  externals: nodeExternals({
    allowlist: [/\.css$/, 'gobal.js'],
  }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"',
    }),
    new VueSSRServerPlugin(),
  ],
});
