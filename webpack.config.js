const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      inject: true,
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    open: true,
    port: 8088,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      "/styles/*.css": {
        "Content-Type": "text/css",
      },
      "/scripts/*.js": {
        "Content-Type": "application/javascript",
      },
    },
    proxy: [
      {
        context: "/api/auth",
        target: "http://localhost:8081",
        changeOrigin: true,
        pathRewrite: { "^/api/auth": "/auth" },
      },
      {
        context: "/api/profile",
        target: "http://localhost:8082",
        changeOrigin: true,
        pathRewrite: { "^/api/profile": "/profile" },
      },
    ],
  },
};
