import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onlineUsers = new Set();

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;
    onlineUsers.add(userId);
    io.emit("user_status", { userId, isOnline: true });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("user_status", { userId, isOnline: false });
    });

    socket.on("message", (message) => {
      // Simulate network delay and message status updates
      setTimeout(() => {
        message.status = "sent";
        io.emit("message", message);

        setTimeout(() => {
          message.status = "delivered";
          io.emit("message", message);
        }, 1000);
      }, 500);
    });
  });

  res.end();
};

export default SocketHandler;