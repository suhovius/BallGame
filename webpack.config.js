var webpack = require('webpack');

module.exports = ({
  entry: {
    main: './app/js/main.jsx',
  },
  output: {
    path: __dirname + "/javascripts",
    filename: "game.js",
    publicPath: "/javascripts/"
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  watch: true,
  devtool: 'source-map'
});

