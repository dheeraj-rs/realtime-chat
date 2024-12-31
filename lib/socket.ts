import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000', {
  autoConnect: false,
});

export const connectSocket = (userId: string) => {
  socket.auth = { userId };
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};