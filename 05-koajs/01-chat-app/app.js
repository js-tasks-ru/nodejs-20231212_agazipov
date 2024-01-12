const path = require('path');
const Koa = require('koa');
const app = new Koa();

const {EventEmitter} = require('stream');

// кастомное событие для передачи сигнала из одного запроса в другой
// при успешном POST запросе возникет событие 'my_emit'
// в промисе GET вешается слушатель и при срабатывании резолвит промис и пишет сообщение в чат
const myEE = new EventEmitter();


app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

// симулятор хранилища сообщений
const messages = [];
const validKey = 'message';

app.use(async (ctx, next) => {
  // мидлвар для обработки ошибок
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
  await new Promise((resolve) => {
    function callBackEventEmiter() {
      // функция объявлена здесь чтобы был локальный доступ к аргументу резолв
      resolve(callBackEventEmiter);
    };

    myEE.on('my_emit', callBackEventEmiter);
  }).then((callBackEventEmiter) => {
    // чтобы не перегружать слушателями сервер закрываю их передавая в резолв колбек этого эмитера
    myEE.off('my_emit', callBackEventEmiter);
  });
  ctx.body = messages[messages.length - 1];
});

router.post('/publish', async (ctx, next) => {
  // обработка ошибки с пустым телом в POST
  if (!(validKey in ctx.request.body)) throw new Error('bad_request');
  const message = ctx.request.body.message;
  messages.push(message);
  ctx.body = 'its okey';

  // кастомное событие возникает для слушателя в GET
  myEE.emit('my_emit');
});

app.use(router.routes());

module.exports = app;
