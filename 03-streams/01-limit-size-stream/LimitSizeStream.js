const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.transferredSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.transferredSize += chunk.byteLength;
    if (this.transferredSize > this.limit) {
      const error = new LimitExceededError();
      callback(error);
    } else {
      callback(null, chunk);
    }
  }
}


module.exports = LimitSizeStream;
