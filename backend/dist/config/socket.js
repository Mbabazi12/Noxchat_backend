"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: { origin: process.env.CLIENT_URL },
    });
    io.on('connection', (socket) => {
        socket.on('join_room', (roomId) => socket.join(roomId));
        socket.on('leave_room', (roomId) => socket.leave(roomId));
    });
};
exports.initSocket = initSocket;
const getIO = () => io;
exports.getIO = getIO;
//# sourceMappingURL=socket.js.map