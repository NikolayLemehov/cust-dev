// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require(`path`);
const HTMLWebpackPlugin = require(`html-webpack-plugin`);
const {CleanWebpackPlugin} = require(`clean-webpack-plugin`);
const CopyWebpackPlugin = require(`copy-webpack-plugin`);
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`);
const OptimizeCssAssetWebpackPlugin = require(`optimize-css-assets-webpack-plugin`);
const TerserWebpackPlugin = require(`terser-webpack-plugin`);

const isDev = process.env.NODE_ENV === `development`;
const isProd = !isDev;
console.log(`isDev`, isDev);

const getOptimization = () => {
  const config = {
    splitChunks: {
      chunks: `all`
    }
  };
  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }
};

const getParam = (param) => {
  console.log(param);
  return param;
};

module.exports = {
  context: path.resolve(__dirname, 'source'),
  // mode: 'development', // Режим сборки
  // mode: 'production', // Режим сборки
  entry: `./js/main.js`, // Точка входа приложения
  output: {// Настройка выходного файла
    filename: `js/bundle.js`,
    path: path.join(__dirname, `build`),
    sourcePrefix: '../'
  },
  devtool: 'source-map', // Подключаем sourcemaps
  optimization: getOptimization(),
  devServer: {
    port: 4200,
    hot: isDev
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: `./index.html`,
      filename: path.join(__dirname, `build/`, `index.html`),
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      // {
      //   from: `./css`,
      //   to: path.join(__dirname, `build/css/`)
      // },
      {
        from: `./fonts`,
        to: path.join(__dirname, `build/fonts/`)
      },
      // {
      //   from: `./img`,
      //   to: path.join(__dirname, `build/img/`)
      // },
      {
        from: `./layout`,
        to: path.join(__dirname, `build/layout/`)
      }
    ]),
    new MiniCssExtractPlugin({
      filename: `./css/style.min.css`
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true
            },
          },
          `css-loader`,
          `sass-loader`
        ],
      },
      {
        test: /\.(png|jpg|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '../[path][name].[ext]'
            },
          }
        ],
      },
      {
        test: /\.(woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '../[path][name].[ext]'
            },
          }
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
      },
    ],
  },
};
