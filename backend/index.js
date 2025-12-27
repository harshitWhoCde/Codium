const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const ACTIONS = require('./Actions');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const userSocketMap = {};

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    // 1. JOIN LOGIC
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    // 2. CODE SYNC LOGIC
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // 3. SYNC CODE (on join)
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // 4. CHAT LOGIC
    socket.on(ACTIONS.SEND_MESSAGE, ({ roomId, message, username, time }) => {
        // Broadcast to everyone else in the room
        socket.in(roomId).emit(ACTIONS.RECEIVE_MESSAGE, {
            username,
            message,
            time,
        });
    });

    // 5. TYPING INDICATOR LOGIC
    socket.on(ACTIONS.TYPING, ({ roomId, username }) => {
        socket.in(roomId).emit(ACTIONS.TYPING, { username });
    });

    socket.on(ACTIONS.STOP_TYPING, ({ roomId, username }) => {
        socket.in(roomId).emit(ACTIONS.STOP_TYPING, { username });
    });

    // 6. SYNC OUTPUT (Run Code Results)
    socket.on(ACTIONS.SYNC_OUTPUT, ({ roomId, output }) => {
        console.log(`📢 Output sync received for room ${roomId}`);
        // Broadcast to everyone in the room
        io.to(roomId).emit(ACTIONS.SYNC_OUTPUT, { output });
    });

    // 7. DISCONNECT LOGIC
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });

}); // <--- THIS CLOSING BRACKET WAS IN THE WRONG PLACE BEFORE

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));