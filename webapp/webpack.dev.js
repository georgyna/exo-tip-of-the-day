const path = require('path');
const merge = require('webpack-merge');
const webpackCommonConfig = require('./webpack.common.js');

// the display name of the war
const app = 'tipoftheday';

// add the server path to your server location path
// const exoServerPath = "/eXo/tip-of-the-day/platform-community-5.2.2";
const exoServerPath = "D:/sasha_work/2020/exo-tip/platform-community-5.2.2-tipoftheday-react/platform-community-5.2.2";

let config = merge(webpackCommonConfig, {
  output: {
    path: path.resolve(`${exoServerPath}/webapps/${app}/`)
  },
  devtool: 'inline-source-map'
});

config.mode = "development";

module.exports = config;
