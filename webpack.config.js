const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/app/index.ts",
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
        test: /\.(ts|tsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/app/index.html",
      filename: "index.html",
      inject: true,
    }),
  ],
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx"],
    alias: {
      vdom: path.resolve(__dirname, "lib/vdom/lib"),
    },
    preferRelative: true,
  },
  devServer: {
    static: [
      {
        directory: path.join(__dirname, "dist"),
      },
      {
        directory: path.join(__dirname, "myback"),
        publicPath: "/myback/",
      },
    ],
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
        pathRewrite: {
          "^/api/auth/token-endpoint": "/token-endpoint",
          "^/api/auth": "/auth",
        },
      },
      {
        context: "/api/accounts",
        target: "http://localhost:8082",
        changeOrigin: true,
        pathRewrite: {
          "^/api/accounts/token-endpoint": "/token-endpoint",
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
          "^/api/danya/token-endpoint": "/token-endpoint",
          "^/api/danya/author/(.*)/background": "/author/$1/background",
          "^/api/danya/author/(.*)/tip": "/author/$1/tip",
          "^/api/danya/author/(.*)": "/author/$1",
          "^/api/danya/author/payments": "/author/payments",
          "^/api/danya/author/update/background": "/author/update/background",
          "^/api/danya/author/update/info": "/author/update/info",

          "^/api/danya/subscription/request": "/subscription/request",
          "^/api/danya/subscription/realize": "/subscription/realize",
          "^/api/danya/unsubscription": "/unsubscription",
        },
      },

      {
        context: "/api/posts",
        target: "http://localhost:8084",
        changeOrigin: true,
        pathRewrite: {
          "^/api/posts/token-endpoint": "/token-endpoint",
          "^/api/posts/feed/popular": "/feed/popular",
          "^/api/posts/feed/subscriptions": "/feed/subscriptions",
          "^/api/posts/post/update": "/post/update",
          "^/api/posts/post/upload/media/(.*)": "/post/upload/media/$1",
          "^/api/posts/post/upload/content": "/post/upload/content",
          "^/api/posts/post/media/(.*)": "/post/media/$1",
          "^/api/posts/post/like": "/post/like",
          "^/api/posts/post": "/post",
          "^/api/posts/delete/post/(.*)": "/delete/post/$1",
          "^/api/posts/author/post/(.*)": "/author/post/$1",
          // "^/api/posts/static/(.*)": "/static/$1",
          // "^/api/posts/(.*)": "/$1",
        },
      },
      {
        context: "/api/tech",
        target: "http://localhost:8085",
        changeOrigin: true,
        pathRewrite: {
          "^/api/tech/token-endpoint": "/token-endpoint",

          "^/api/tech/subscription/custom": "/subscription/custom",
          "^/api/tech/subscription/layer": "/subscription/layer",
          "^/api/tech/subscription/(.*)/custom": "/subscription/$1/custom",
        },
      },
    ],
  },
};
