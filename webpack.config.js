const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
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
      // {
      //   test: /\.(png|jpe?g|gif|svg)$/i,
      //   use: [
      //     {
      //       loader: "file-loader",
      //       options: {
      //         name: "[path][name].[ext]", // Сохранение структуры папок
      //         outputPath: "images/", // Папка для выходных изображений
      //       },
      //     },
      //   ],
      // },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/app/index.html",
      filename: "index.html",
      inject: true,
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "src/app/sw.js", to: "sw.js" }],
    }),
  ],
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx"],
    alias: {
      vdom: path.resolve(__dirname, "lib/vdom/lib"),
    },
    preferRelative: true,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
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
    port: 8099,
    historyApiFallback: {
      rewrites: [{ from: /^\/sw\.js$/, to: "/sw.js" }],
    },
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
        context: "/api/pages",
        target: "http://localhost:8083",
        changeOrigin: true,
        pathRewrite: {
          "^/api/pages/token-endpoint": "/token-endpoint",
          "^/api/pages/author/(.*)/background": "/author/$1/background",
          "^/api/pages/author/(.*)/tip": "/author/$1/tip",
          "^/api/pages/author/(.*)": "/author/$1",
          "^/api/pages/author/payments": "/author/payments",
          "^/api/pages/author/update/background": "/author/update/background",
          "^/api/pages/author/update/info": "/author/update/info",

          "^/api/pages/subscription/request": "/subscription/request",
          "^/api/pages/subscription/realize": "/subscription/realize",
          "^/api/pages/unsubscription": "/unsubscription",
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
          "^/api/posts/post/delete/media/(.*)": "/post/delete/media/$1",
        },
      },
      {
        context: "/api/tech",
        target: "http://localhost:8085",
        changeOrigin: true,
        pathRewrite: {
          "^/api/tech/token-endpoint": "/token-endpoint",
          "^/api/tech/search/(.*)": "/search/$1",
          "^/api/tech/subscription/custom": "/subscription/custom",
          "^/api/tech/subscription/layers": "/subscription/layers",
          "^/api/tech/subscription/allowed/layers":
            "/subscription/allowed/layers",
          "^/api/tech/subscription/(.*)/custom": "/subscription/$1/custom",
        },
      },
      {
        context: "/api/csat",
        target: "http://localhost:8086",
        changeOrigin: true,
        pathRewrite: {
          "^/api/csat/token-endpoint": "/token-endpoint",

          "^/api/csat/result/(.*)": "/csat/result/$1",
          "^/api/csat/check": "/csat/check",
          "^/api/csat/question": "/csat/question",
          "^/api/csat/table": "/csat/table",
        },
      },
      {
        context: "/api/moderation",
        target: "http://localhost:8087",
        changeOrigin: true,
        pathRewrite: {
          "^/api/moderation/token-endpoint": "/token-endpoint",
          "^/api/moderation/moderation/post": "/moderation/post",
          "^/api/moderation/moderation/post/decision":
            "/moderation/post/decision",
          "^/api/moderation/moderation/post/complaint":
            "/moderation/post/complaint",
        },
      },
    ],
  },
};
