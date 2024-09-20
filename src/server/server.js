const http = require('http');
const fs = require('fs');

const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const server = http.createServer((req, res) => {
  const url = req.url;
  let filePath = `..${url}`;

  if ((url == "/") || (url == '/login') || (url == '/signup')
     || url == '/profile' || url == '/feed' || url == '/error') {
    filePath = '../index.html';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end(`${err}`);
    } else {
      if (filePath.endsWith('.js')) {
        res.writeHead(200, {'Content-Type': 'application/javascript'});
      } else if (filePath.endsWith('.css')) {
        res.writeHead(200, {'Content-Type': 'text/css'});
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
      }
      res.end(data);
    }
  });
});

server.listen(8080, () => {
  console.log(`Server started on port 8080`);
});