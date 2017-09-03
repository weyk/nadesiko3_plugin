const path = require('path')
const srcPath = path.join(__dirname, 'src')
const releasePath = path.join(__dirname, 'release')

process.noDeprecation = true

module.exports = {
  entry: {
    plugin_weykdatetime: path.join(srcPath, 'plugin_weykdatetime.js')
  },

  output: {
    path: releasePath,
    filename: '[name].js'
  },

  devtool: 'cheap-module-eval-source-map',

  module: {
    loaders: [
      // .js file
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
        include: [srcPath],
        query: {
          presets: ['env']
        }
      }
    ]
  },

  resolve: {
    extensions: ['*', '.webpack.js', '.web.js', '.js']
  }
}
