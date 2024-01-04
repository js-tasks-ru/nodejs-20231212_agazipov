const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.cash = '';
  }

  _transform(chunk, _encoding, callback) {
    const chunkToString = chunk.toString('utf-8');
    // если в строке есть перенос то разделяем на массив иначе добавляем чанк в кэш
    if (chunkToString.includes(`${os.EOL}`)) {
      const chunkArray = chunkToString.split(`${os.EOL}`);
      // прибавляем к первому элементу массива значение из кэша
      chunkArray[0] = this.cash + chunkArray[0];
      // пушим элементы массива в лайн, а послений пишем в кэш
      chunkArray.forEach((element, index, arr) => {
        if (!(index === arr.length - 1)) {
          this.push(Buffer.from(element));
        } else {
          this.cash = element;
        }
      });
      callback();
    } else {
      this.cash += chunkToString;
      callback();
    }
  }

  _final(callback) {
    // очистка кэша
    this.push(Buffer.from(this.cash));
    callback();
  }

  _flush(callback) {
    callback();
  }
}

module.exports = LineSplitStream;
