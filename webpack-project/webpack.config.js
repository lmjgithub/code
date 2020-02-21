const path = require("path");
const HtmlWebpack = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [{ test: /\.js$/, use: "babel-loader" }]
  },
  plugins: [
    new HtmlWebpack({ template: "./index.html" }),
    new CleanWebpackPlugin()
  ],
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: "all",
      minSize: 0,
      minChunks: 1,
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        vendors: {
          name: "react",
          minChunks: 1,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          minSize: 0
        },
        default: {
          test: /[\\/]components[\\/]/,
          priority: -20,
          name(module) {
            const moduleFileName = module
              .identifier()
              .split("\\")
              .pop()
              .replace(".js", "");
            return `${moduleFileName}`;
          }
        }
      }
    }
  }
};
