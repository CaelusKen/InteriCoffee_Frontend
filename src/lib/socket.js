// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Server } = require("socket.io");

let io = null;

const initSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      path: "/api/socketio",
    });

    io.on("connection", (socket) => {
      console.log("A client connected");

      socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`Client joined room: ${roomId}`);
      });

      socket.on("send-message", (message) => {
        io.to(message.roomId).emit("receive-message", message);
        console.log(`Message sent to room ${message.roomId}: ${message.content}`);
      });

      socket.on("disconnect", () => {
        console.log("A client disconnected");
      });
    });
  }
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized');
  }
  return io;
};

module.exports = { initSocket, getIO };