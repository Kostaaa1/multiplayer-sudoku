import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import "dotenv/config";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

const io = new Server(server);
io.on("connection", (socket: any) => {
  console.log("User joined: ", socket.id);
  socket.join(socket.id);
  socket.emit("clientId", socket.id);

  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  socket.on("notifySocket", (data: { player2: string }) => {
    io.to(data.player2).emit("notify", data);
  });

  socket.on("roomMessage", (data: { roomId: string }) => {
    io.to(data.roomId).emit("message", data);
  });

  socket.on("endGame", (data: any) => {
    const { player } = data;
    io.to(player).emit("endGame", data);
  });

  socket.on("isOpponentReady", (player: any) => {
    io.to(player).emit("isOpponentReady");
  });

  socket.on("countdown", (room: any) => {
    io.to(room).emit("countdown");
  });

  socket.on("disconnect", () => {
    // NEED TO IMPROLVE THIS SUCKS
    const rooms = io.sockets.adapter.rooms;
    const room = Array.from(rooms.keys())
      .map((x) => x.split(socket.id))
      .filter((x) => x.length > 1);

    if (room) {
      const s = room.find((x) => x.length > 0);
      if (s) io.to(s).emit("userDisconnected", `Player ${socket.id} disconnected from the room.`);
    }
  });
});

server.listen(3000, () => {
  console.log(`Server is running on ${3000}`);
});
