/*
 * @Author: 黄 楠
 * @Date: 2019-04-30 13:59:40
 * @Last Modified by: 黄 楠
 * @Last Modified time: 2019-05-09 10:12:29
 * @Description:
 */
const merge = require("webpack-merge");
const base = require("./webpack.base.config");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");

module.exports = merge(base, {
  entry: {
    app: "./src/entry-client.ts",
  },
  optimization: {
    // extract webpack runtime & manifest to avoid vendor chunk hash changing
    // on every build.
    runtimeChunk: {
      name: 'manifest',
    },
    // extract vendor chunks for better caching
    splitChunks: {
      chunks: 'initial',
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test(module) {
            // a module is extracted into the vendor chunk if...
            return (
              // it's inside node_modules
              /node_modules/.test(module.context) &&
              // and not a CSS file
              !/\.css$/.test(module.request)
            )
          }
        }
      }
    }
  },
  plugins: [
    new VueSSRClientPlugin(),
  ],
});