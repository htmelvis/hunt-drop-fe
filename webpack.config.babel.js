import webpack from 'webpack';
import { resolve } from 'path';
import { getIfUtils } from 'webpack-config-utils';

// Style Related Packages
import poststylus from 'poststylus';
import autoprefixer from 'autoprefixer';
import rucksackCSS from 'rucksack-css';
import rupture from 'rupture';
import typographic from 'typographic';

// Webpack Add-Ons
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default env => {
  const {ifProd, ifNotProd} = getIfUtils(env);
  const config = {
    context: resolve('src'),
    entry: './app.js',
    output: {
      filename: 'bundle.js',
      path: resolve('dist'),
      publicPath: '/dist/',
      pathinfo: ifNotProd(),
    },
    devtool: ifProd('source-map', 'eval'),
    module: {
      rules: [
        {test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/},
        {test: /\.css$/, use: ExtractTextPlugin.extract({ loader: 'css-loader?importLoaders=1!postcss-loader' }) },
        { test: /\.styl?$/,
          use: [
            { loader: "style-loader"},
            { loader: "css-loader"},
            { loader: "stylus-loader"}
          ]
        },
        { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$/, use: "file-loader" },
        { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, use: "url-loader?limit=10000&mimetype=application/font-woff" },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: "url-loader?limit=10000&mimetype=application/octet-stream" },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: "file-loader" },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: "url-loader?limit=10000&mimetype=image/svg+xml" },
        {
          test: /\.html$/,
          use: [ {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }],
        }
      ],
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        options: {
          stylus: {
            use: [
              typographic(),
              rupture(),
              poststylus([autoprefixer, rucksackCSS, require('postcss-flexibility')])
            ]
          },
        }
      }),
      new ExtractTextPlugin('styles/[name].bundle.css'),
      new HtmlWebpackPlugin({
        template: 'index.html'
      }),
    ]
  };
  if (env.debug) {
    console.log(config)
    debugger // eslint-disable-line
  }
  if(env.dev){
    config.devServer = {

    }
  }
  return config
}