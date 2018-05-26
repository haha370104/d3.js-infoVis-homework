module.exports = {
  devtool: 'source-map',
  entry: __dirname + "/src/main.ts",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  },

  devServer: {
    contentBase: "./public",
    historyApiFallback: true,
    inline: true
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    rules: [
      {test: /\.ts$/, loader: 'ts-loader'}
    ]
  }
}
