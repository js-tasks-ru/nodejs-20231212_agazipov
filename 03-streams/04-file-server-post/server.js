/* eslint-disable linebreak-style */
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();


server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  const streamLimit = new LimitSizeStream({
    limit: 4300000,
    readableObjectMode: false,
  });

  switch (req.method) {
    case 'POST':

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('problem path');
        break;
      }

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('change name');
        break;
      }

      const writable = fs.createWriteStream(filepath);
      req.pipe(streamLimit).pipe(writable);

      writable.on('finish', () => {
        res.statusCode = 201;
        res.end('succes');
      });

      // большой размер
      streamLimit.on('error', (err) => {
        console.error(`streamLimitERR`, err.message);
        writable.end();
        fs.unlinkSync(filepath, (err) => {
          if (err) throw err;
        });
        res.statusCode = 413;
        res.end('max size');
      });
      // дисконект
      req.on('error', (err) => {
        if (err.code === 'ECONNRESET' || err.code === 'EPIPE' || err.code === 'ECONNABORTED') {
          streamLimit.end();
          writable.end();
          fs.unlink(filepath, (err2) => {
            if (err2) throw err2;
          });
          res.statusCode = 600;
          res.end('no entry files');
          return;
        }
        res.statusCode = 500;
        res.end('other error');
      });

      break;

    default:
      res.statusCode = 500;
      res.end('Not implemented');
  }
});

module.exports = server;