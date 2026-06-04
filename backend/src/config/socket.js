const { Server } = require('socket.io');
let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL }
  });

  io.on('connection', (socket) => {
    socket.on('join_room', (roomId) => socket.join(roomId));
    socket.on('leave_room', (roomId) => socket.leave(roomId));
    socket.on('disconnect', () => {});
  });
};

const getIO = () => io;

module.exports = { initSocket, getIO };
