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
  socket.emit("clientId", { type: "client", room: socket.id });
  socket.on(
    "joinRoom",
    (roomData: { room: string; player: string | null; difficulty: string }) => {
      console.log("roomData dksoakdoksoakdok", roomData);
      const { player, room, difficulty } = roomData;
      // socket.leave(socket.id);
      socket.join(room);
      console.log(`User ${player} joined room: ${room}. Current socketId: ${socket.id}`);
      if (player) {
        io.to(player).emit("clientId", { type: "room", room, player: socket.id, difficulty });
      } else {
        io.to(socket.id).emit("onJoin", roomData);
      }
    }
  );

  socket.on("isOpponentReady", (player: any) => {
    io.to(player).emit("isOpponentReady");
  });

  socket.on("endGame", (data: any) => {
    const { player } = data;
    io.to(player).emit("endGame", data);
  });

  socket.on("roomData", (roomData: { room: string; data: any }) => {
    console.log("roomData called", roomData);
    io.to(roomData.room).emit("roomData", roomData.data);
  });

  socket.on("countdown", (room: any) => {
    io.to(room).emit("countdown");
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected with custom ID: ${socket.id}`);
  });
});

app.get("/", (_, res) => {
  res.send("Hello from server");
});

app.get("/test", (_, res) => {
  res.send("TEST");
});

server.listen(3000, () => {
  console.log(`Server is running on ${3000}`);
});
