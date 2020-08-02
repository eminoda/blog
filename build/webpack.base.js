/**
 * webpack 基础公用配置
 *
 * 配置说明：https://webpack.js.org/configuration/
 */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, '../'),
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.runtime.common.js',
    },
    extensions: ['.js', '.vue', '.json'],
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              // extractCSS: true,
              // compilerOptions: {
              //   preserveWhitespace: false,
              // },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'vue-style-loader',
            options: {
              // sourceMap: false,
              // shadowMode: false,
            },
          },
          {
            loader: 'css-loader',
            options: {
              // sourceMap: false,
              // importLoaders: 2,
              // modules: {
              //   localIdentName: '[name]_[local]_[hash:base64:5]',
              // },
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'vue-style-loader',
            options: {
              // sourceMap: false,
              // shadowMode: false,
            },
          },
          {
            loader: 'css-loader',
            options: {
              // sourceMap: false,
              // importLoaders: 2,
              // modules: {
              //   localIdentName: '[name]_[local]_[hash:base64:5]',
              // },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]',
                  esModule: false,
                },
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // new CleanWebpackPlugin({
    //   // verbose: true
    // }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'eminoda blog',
      filename: `index.html`,
      template: path.join(__dirname, '../src/index.template.html'),
      inject: true,
    }),
  ],
};
