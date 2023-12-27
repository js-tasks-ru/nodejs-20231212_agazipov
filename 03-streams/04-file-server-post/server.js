/* eslint-disable linebreak-style */
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();


server.on('request', (req, res) => {
  console.log('__size__', req.headers['content-length']);
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  const streamLimit = new LimitSizeStream({
    limit: 1000000,
    readableObjectMode: false,
  });

  switch (req.method) {
    case 'POST':
      console.log('________________________________');

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('problem path');
        break;
      }

      if (fs.existsSync(filepath)) {
        console.log('файл есть');
        res.statusCode = 409;
        res.end('change name');
        break;
      }

      // if (parseInt(req.headers['content-length']) > 999999) {
      //   res.statusCode = 413;
      //   res.end('max size');
      //   break;
      // }

      const writable = fs.createWriteStream(filepath);
      req.pipe(streamLimit).pipe(writable);

      // дубль файла ** код ошибки
      writable.on('error', (err) => {
        console.error('readERR', err);
        res.statusCode = 409;
        res.end('change name');
      });
      // большой размер
      streamLimit.on('error', (err) => {
        console.error(`streamLimitERR`, err.message);
        writable.end();
        writable.on('close', (e) => {
          fs.unlink(filepath, (err2) => {
            if (err2) throw err2;
            console.log('path/file.txt was deleted');
          });
        });
        res.statusCode = 413;
        res.end('max size');
      });
      // дисконект
      req.on('error', (err) => {
        console.error(err.message);
        if (err.code === 'ECONNRESET' || err.code === 'EPIPE' || err.code === 'ECONNABORTED') {
          streamLimit.end();
          writable.end();
          fs.unlink(filepath, (err2) => {
            if (err2) throw err2;
            console.log('path/file.txt was deleted obryv');
          });
          res.statusCode = 404;
          res.end('no entry files');
        } else {
          res.statusCode = 500;
          res.end('other error');
        }
      });

      writable.on('finish', () => {
        res.statusCode = 201;
        res.end('succes');
      });

      req.on('close', () => {
        console.log(`req close`);
      });
      req.on('end', () => {
        console.log('reqEnd');
      });
      streamLimit.on('close', () => {
        console.log('streamLimit close');
      });
      streamLimit.on('pipe', () => {
        console.log('streamLimit pipe');
      });

      writable.on('close', () => {
        console.log('wrible close');
      });

      break;

    default:
      res.statusCode = 500;
      res.end('Not implemented');
  }
});

module.exports = server;