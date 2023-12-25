const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const files = fs.createReadStream(filepath);

  switch (req.method) {
    case 'GET':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('problem path');
      }
      files.on('data', (chunk) => {
        res.statusCode = 200;
        res.write(chunk);
      });
      files.on('error', (err) => {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          console.log(err.message);
          res.end('no entry files');
        } else {
          res.statusCode = 500;
          res.end('other error');
        }
      });
      files.on('end', () => {
        res.end();
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
