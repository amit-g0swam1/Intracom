import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (url: string = 'http://localhost:3000', conversationId?: string): Socket => {
  if (socket) return socket;

  const id = conversationId || crypto.randomUUID();

  socket = io(url, {
    query: {
      conversationId: id,
    },
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
