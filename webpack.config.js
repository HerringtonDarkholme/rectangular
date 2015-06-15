module.exports = {
  context: __dirname,
  entry: './test',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.ts', '.webpack.js', '.web.js', '.js']
  },
  devtool: 'source-map',
  module: {
    loaders: [{
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
    }]
  }
};
