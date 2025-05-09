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
        socket.join(roomId);
      });
    });

    socket.on("sendMessage", (roomId, senderId, content) => {
      io.to(roomId).emit("receiveMessage", {
        message: `${socket.id} send to members in room id ${roomId} message ${content}`,
        data: {
          senderId,
          content
        }
      })
    })

    socket.on("disconnect", () => {
      console.log("User disconnected! socketId: ", socket.id);
    });
  });
};
