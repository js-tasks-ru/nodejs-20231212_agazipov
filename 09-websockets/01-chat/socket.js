const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    console.log('token', socket.handshake.query.token);
    if (!socket.handshake.query.token) {
      return next(new Error('anonymous sessions are not allowed'));
    }
    const session = await Session.findOne({token: socket.handshake.query.token}).populate('user');
    if (!session) {
      throw new Error('wrong or expired session token');
    }
    socket.user = session.user;
    next();
  });

  io.on('connection', function(socket) {
    const {displayName, _id} = socket.user;
    socket.on('message', async (msg) => {
      await Message.create({
        user: displayName,
        chat: _id,
        text: msg,
        date: new Date(),
      });
      socket.broadcast.emit(msg);
    });
  });

  io.on('connect_error', (err) => {
    console.log(err.message);
  });

  return io;
}

module.exports = socket;
