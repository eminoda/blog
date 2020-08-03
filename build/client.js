/**
 * webpack 客户端配置
 *
 * 配置说明：https://webpack.js.org/configuration/
 */
const path = require('path');
const { merge } = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

module.exports = merge(webpackBaseConfig, {
  entry: {
    app: './src/entry-client.js',
  },
  output: {
    path: path.resolve(__dirname, '../dist'), // The output directory as **absolute path** (required)
    publicPath: '/dist/',
    filename: '[name].js',
  },
  plugins: [new VueSSRClientPlugin()],
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    compress: false,
    port: 3000,
    hot: true,
  },
});
