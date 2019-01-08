const path = require('path');

const context = path.join(__dirname, 'src');

module.exports = {
  mode: 'development',
  context,
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: /(\.js)/,
      exclude: /(node_modules|dist)/,
      use: [{
        loader: 'babel-loader',
      }],
    }],
  },
  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
    extensions: ['.js'],
  },
}
