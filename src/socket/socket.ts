import { Server } from "socket.io";
import http from "http";

export const configureSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.emit("welcome", {
      message: "Welcome to the server! socketId: " + socket.id,
    });

    socket.on("joinChatRooms", (roomIds) => {
      roomIds.forEach((roomId: string) => {
        console.log(socket.id + " join room chat: " + roomId);
        socket.join(roomId);
      });
      roomIds.forEach((roomId: string) => {
        io.to(roomId).emit("userJoined", {
          message: `A user with socketId ${socket.id} joined room ${roomId}`,
        });
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected! socketId: ", socket.id);
    });
  });
};
