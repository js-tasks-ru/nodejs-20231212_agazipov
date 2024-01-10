const path = require('path');
const Koa = require('koa');
const app = new Koa();
const fs = require('node:fs');
const {EventEmitter} = require('stream');

const myEE = new EventEmitter();
// myEE.prependListener('foo', () => console.log('b'));

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const messages = [];
const readMessages = fs.createWriteStream(path.join(__dirname, 'public/history.txt'));

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.message === 'bad_request') {
      ctx.status = 400;
      ctx.body = `server error ${err.message}`;
    } else {
      ctx.status = 500;
      ctx.body = `server error ${err.message}`;
    }
  }
});

router.get('/subscribe', async (ctx, next) => {
  console.log('server_get');
  await new Promise((resolve) => {
    function callBackEventEmiter() {
      resolve(callBackEventEmiter);
    };
    myEE.on('my_emit', callBackEventEmiter);
  }).then((callBackEventEmiter) => {
    myEE.off('my_emit', callBackEventEmiter);
  });
  console.log('server_get_2');
  ctx.body = messages[messages.length - 1];
});

router.post('/publish', async (ctx, next) => {
  const validKey = 'message';
  const message = ctx.request.body.message;
  if (!(validKey in ctx.request.body)) throw new Error('bad_request');
  messages.push(message);
  // ctx.req.pipe(readMessages);
  readMessages.write(`${message}\n`);
  // readMessages.end();
  ctx.body = 'its okey';

  myEE.emit('my_emit');
});

app.use(router.routes());

module.exports = app;
