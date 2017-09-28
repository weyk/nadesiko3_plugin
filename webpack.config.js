const path = require('path')
const srcPath = path.resolve(__dirname, 'src')
const releasePath = path.resolve(__dirname, 'release')

process.noDeprecation = true

module.exports = {
  entry: {
    plugin_weykthree: path.join(srcPath, 'plugin_weykthree.js'),
    plugin_weykturtle3d: path.join(srcPath, 'plugin_weykturtle3d.js')
  },

  output: {
    path: releasePath,
    filename: '[name].js',
    publicPath: releasePath
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
