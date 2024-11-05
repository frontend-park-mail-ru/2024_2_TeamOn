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
    port: 8090,
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
        pathRewrite: { "^/api/auth": "/auth", "^/api/posts": "" },
      },
      {
        context: "/api/accounts",
        target: "http://localhost:8082",
        changeOrigin: true,
        pathRewrite: {
          "^/api/accounts/account/(.*)/avatar": "/account/$1/avatar",
          "^/api/accounts/account/update/avatar": "/account/update/avatar",
          "^/api/accounts/account/update/role": "/account/update/role",
          "^/api/accounts/account/update": "/account/update",
          "^/api/accounts/account": "/account",
        },
      },
      {
        context: "/api/danya",
        target: "http://localhost:8083",
        changeOrigin: true,
        pathRewrite: {
          "^/api/danya/author/me": "/author/me",
          "^/api/danya/author/(.*)": "/author/$1",
          "^/api/danya/author/payments": "/author/payments",
          "^/api/danya/author/(.*)/background": "/author/$1/background",
          "^/api/danya/author/update/background": "/author/update/background",
          "^/api/danya/author/update/info": "/author/update/info",
          "^/api/danya/author/(.*)/tip": "/author/$1/tip",
        },
      },
      {
        context: "/api/posts",
        target: "http://localhost:8084",
        changeOrigin: true,
        pathRewrite: {
          "^/api/posts/feed/popular": "/feed/popular",
          "^/api/posts/feed/subscriptions": "/feed/subscriptions",
          "^/api/posts/post": "/post",
          "^/api/posts/post/update": "/post/update",
          "^/api/posts/post/upload/content": "/post/upload/content",
          "^/api/posts/post/like": "/post/like",
          "^/api/posts/delete/post/(.*)": "/delete/post/$1",
          "^/api/posts/author/post/(.*)": "/author/post/$1",
        },
      },
    ],
  },
};
