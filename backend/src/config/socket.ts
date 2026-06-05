import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export const initSocket = (server: HttpServer): void => {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL },
  });

  io.on('connection', (socket: Socket) => {
    socket.on('join_room', (roomId: string) => socket.join(roomId));
    socket.on('leave_room', (roomId: string) => socket.leave(roomId));
  });
};

export const getIO = (): Server => io;
