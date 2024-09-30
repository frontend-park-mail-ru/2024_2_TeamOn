const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use('/templates', express.static(path.join(__dirname, 'templates'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.hbs')) {
      res.set('Content-Type', 'text/x-handlebars-template'); 
    }
  }
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});


const URLS = ["/", "/login", "/signup", "/profile", "/error"];

app.get("*", (req, res) => {
  let filePath = path.join(__dirname, `..${req.url}`);

  if (URLS.includes(req.url)) {
    filePath = path.join(__dirname, "../index.html");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(404).send(`${err}`);
    } else {
      let headers = {};
      if (filePath.endsWith(".js")) {
        headers["Content-Type"] = "application/javascript";
      } else if (filePath.endsWith(".css")) {
        headers["Content-Type"] = "text/css";
      } else {
        headers["Content-Type"] = "text/html";
      }

      res.writeHead(200, headers);
      res.end(data);
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
