#meta-start
Title:Simple Node Web Server
Created:5-12-2020
Category:node
#meta-end
# Simple Node Web Server

I wanted a simple web server while developing a front-end web application using Vue JS. Node Express was overkill, since I wasn't using it for production. IIS Express is alternative, but normally installed with Visual Studio. This server can be used with VS Code with the following command; `node server.js`

> To skip Typescript compiler, edit/replace `import` with `var`

*server.ts*

```ts
import http = require('http');
import fs = require('fs');
const port = process.env.port || 1337;
console.log("Starting server on port " + port);

const redirectPage = '<!DOCTYPE html><html><head><meta charset="utf-8" /><meta http-equiv="refresh" content="0; url=./dist/" /><title></title></head><body></body></html>';

http.createServer(function (req, res) {
    //console.log(req.method);
    //console.log(req.url);
    //console.log(req.headers);
    //console.log(req.rawHeaders);
    //TODO: remove query parameters ?para=value

    //when empty, redirect
    if (req.url === "/") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(redirectPage);
        return res.end();
    }

    let url = "." + req.url;
    let ext = "";
    if (req.url.endsWith("/")) {
        url = `.${req.url}index.html`;
        ext = "html";
    }
    else if (req.url === "/favicon.ico") {
        //Chrome browser asking for icon
        url = `./dist${req.url}`;
        ext = "ico";
    }
    else if (req.url.lastIndexOf(".") > -1) {
        let s = req.url.split(".");
        if (s.length > 0) {
            ext = s[s.length - 1];
        }
    }

    switch (ext) {
        case "css":
            fs.readFile(url, function (err, data) {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.write(data);
                return res.end();
            });
            break;
        case "js":
            fs.readFile(url, function (err, data) {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.write(data);
                return res.end();
            });
            break;
        case "png":
            fs.readFile(url, function (err, data) {
                res.writeHead(200, { 'Content-Type': 'image/png' });
                res.write(data);
                return res.end();
            });
            break;
        case "gif":
            fs.readFile(url, function (err, data) {
                res.writeHead(200, { 'Content-Type': 'image/gif' });
                res.write(data);
                return res.end();
            });
            break;
        case "jpg":
            fs.readFile(url, function (err, data) {
                res.writeHead(200, { 'Content-Type': 'image/jpg' });
                res.write(data);
                return res.end();
            });
            break;
        case "ico":
            fs.readFile(url, function (err, data) {
                res.writeHead(200, { 'Content-Type': 'image/ico' });
                res.write(data);
                return res.end();
            });
            break;
        case "html":
            fs.readFile(url, function (err, data) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                return res.end();
            });
            break;
        case "json":
            fs.readFile(url, function (err, data) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(data);
                return res.end();
            });
            break;
        case "map":
            fs.readFile(url, function (err, data) {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.write(data);
                return res.end();
            });
            break;
        case "woff":
            fs.readFile(url, function (err, data) {
                res.writeHead(200, { 'Content-Type': 'font/woff' });
                res.write(data);
                return res.end();
            });
            break;
    }
}).listen(port);
```