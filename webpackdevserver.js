var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var webpackConfig = require('./webpack.config');

//run the webpackdevserver
webpackConfig.entry.app.unshift("webpack-dev-server/client?http://localhost:8000/", "webpack/hot/dev-server");
var compiler = webpack(webpackConfig);
var webpackServer = new WebpackDevServer(compiler, {
  hot: true
});
webpackServer.listen(8000);
