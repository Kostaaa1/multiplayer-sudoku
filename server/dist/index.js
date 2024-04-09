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
    socket.emit("clientId", socket.id);
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });
    socket.on("notifySocket", (data) => {
        io.to(data.player2).emit("notify", data);
    });
    socket.on("roomMessage", (data) => {
        io.to(data.roomId).emit("message", data);
    });
    socket.on("endGame", (data) => {
        const { player } = data;
        io.to(player).emit("endGame", data);
    });
    socket.on("isOpponentReady", (player) => {
        io.to(player).emit("isOpponentReady");
    });
    socket.on("countdown", (room) => {
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
            if (s)
                io.to(s).emit("userDisconnected", `Player ${socket.id} disconnected from the room.`);
        }
    });
});
server.listen(3000, () => {
    console.log(`Server is running on ${3000}`);
});
//# sourceMappingURL=index.js.map