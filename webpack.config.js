module.exports = {
  mode: 'development', // Режим сборки
  output: {// Настройка выходного файла
    filename: `script.js`,
  },
  devtool: 'source-map', // Подключаем sourcemaps
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
    ],
  },
};