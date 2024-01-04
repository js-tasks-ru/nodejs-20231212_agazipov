const LimitSizeStream = require('./LimitSizeStream');
const fs = require('fs');

const limitedStream = new LimitSizeStream({limit: 3, encoding: 'utf-8'}); // 8 байт
const outStream = fs.createWriteStream('out.txt');

limitedStream.pipe(outStream);

limitedStream.write('a'); // 'hello' - это 5 байт, поэтому эта строчка целиком записана в файл

setTimeout(() => {
  limitedStream.write('b'); // ошибка LimitExceeded! в файле осталось только hello
}, 10);
setTimeout(() => {
  limitedStream.write('c'); // ошибка LimitExceeded! в файле осталось только hello
}, 20);
setTimeout(() => {
  limitedStream.write('d'); // ошибка LimitExceeded! в файле осталось только hello
}, 30);
setTimeout(() => {
  limitedStream.write('e'); // ошибка LimitExceeded! в файле осталось только hello
}, 40);
