"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
require("dotenv/config");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
const io = new socket_io_1.Server(server);
io.on("connection", (socket) => {
    console.log("User joined: ", socket.id);
    socket.join(socket.id);
    socket.emit("clientId", { type: "client", room: socket.id });
    socket.on("joinRoom", (roomData) => {
        console.log("roomData dksoakdoksoakdok", roomData);
        const { player, room, difficulty } = roomData;
        // socket.leave(socket.id);
        socket.join(room);
        console.log(`User ${player} joined room: ${room}. Current socketId: ${socket.id}`);
        if (player) {
            io.to(player).emit("clientId", { type: "room", room, player: socket.id, difficulty });
        }
        else {
            io.to(socket.id).emit("onJoin", roomData);
        }
    });
    socket.on("isOpponentReady", (player) => {
        io.to(player).emit("isOpponentReady");
    });
    socket.on("endGame", (data) => {
        const { player } = data;
        io.to(player).emit("endGame", data);
    });
    socket.on("roomData", (roomData) => {
        console.log("roomData called", roomData);
        io.to(roomData.room).emit("roomData", roomData.data);
    });
    socket.on("countdown", (room) => {
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
//# sourceMappingURL=index.js.map