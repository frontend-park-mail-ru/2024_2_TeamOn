const http = require("http");
const fs = require("fs");
const express = require("express");

const app = express();

/**
 * Мiddleware CORS для включения общих ресурсов между источниками
 * Установка заголовка Access-Control-Allow-Origin для разрешения запросов с http://localhost:8080
 * Установка заголовка Access-Control-Allow-Methods для разрешения запросов GET, POST и OPTIONS
 * Установка заголовка Access-Control-Allow-Headers для разрешения заголовков Origin, X-Requested-With, Content-Type, Accept
 * Установка заголовка Access-Control-Allow-Credentials для разрешения отправки учетных данных
 */
app.use((req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Credentials", "true");
});

/**
 * Создание сервера HTTP
 */
const server = http.createServer((req, res) => {
  const url = req.url;
  let filePath = `..${url}`;

  const URLS = ["/", "/login", "/signup", "/profile", "/error"];
  if (URLS.includes(url)) {
    filePath = "../index.html";
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end(`${err}`);
    } else {
      let headers = {};
      if (filePath.endsWith(".js")) {
        headers["Content-Type"] = "application/javascript";
      } else if (filePath.endsWith(".css")) {
        headers["Content-Type"] = "text/css";
      } else {
        headers["Content-Type"] = "text/html";
      }

      if (
        url == "/login" &&
        (!req.headers.cookie || !req.headers.cookie.includes("testCookie"))
      ) {
        headers["Set-Cookie"] =
          "testCookie=testValue2; httpOnly = true; Path=/; SameSite=None; Secure=false; max-age=15";
      }

      res.writeHead(200, headers);
      res.end(data);
    }
  });
});

server.listen(8080, () => {
  console.log(`Server started on port 8080`);
});
