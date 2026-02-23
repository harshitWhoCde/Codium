const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const ACTIONS = require('./Actions');

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// 👇 ADDED: This allows your server to understand JSON data from the frontend
app.use(express.json());

// 👇 ADDED: Your private compiler proxy route!
app.post('/compile', async (req, res) => {
    const { language, sourceCode } = req.body;
    
    try {
        // 1. Send code to Paiza
        const createResponse = await fetch('https://api.paiza.io/runners/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                source_code: sourceCode,
                language: language,
                api_key: 'guest'
            })
        });
        const createData = await createResponse.json();
        const runId = createData.id;

        // 2. Wait 2 seconds for compilation
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 3. Get results
        const resultResponse = await fetch(`https://api.paiza.io/runners/get_details?id=${runId}&api_key=guest`);
        const resultData = await resultResponse.json();

        // 4. Send back to frontend
        const finalOutput = resultData.stdout || resultData.stderr || resultData.build_stderr || "Execution finished with no output.";
        res.json({ output: finalOutput });

    } catch (error) {
        console.error("Compile Error:", error);
        res.status(500).json({ output: "Error compiling code on server." });
    }
});

const userSocketMap = {};

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                // Safe access in case user is missing
                username: userSocketMap[socketId]?.username,
                peerId: userSocketMap[socketId]?.peerId, // 👈 SEND PEER ID
            };
        }
    );
}

io.on('connection', (socket) => {
    
    // 1. JOIN LOGIC (Updated to handle peerId)
    socket.on(ACTIONS.JOIN, ({ roomId, username, peerId }) => {
        // STORE BOTH USERNAME AND PEER ID
        userSocketMap[socket.id] = { username, peerId }; 
        
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
                peerId, // Send new user's peerId to everyone
            });
        });
    });

    // 8. VOICE CALL LOGIC
    socket.on(ACTIONS.JOIN_CALL, ({ roomId, peerId }) => {
        // Update user record with peerId
        if (userSocketMap[socket.id]) {
            userSocketMap[socket.id].peerId = peerId;
        }
        // Notify others to call this user
        socket.in(roomId).emit(ACTIONS.USER_JOINED_CALL, {
            peerId,
            username: userSocketMap[socket.id]?.username,
            socketId: socket.id
        });
    });

    socket.on(ACTIONS.LEAVE_CALL, ({ roomId }) => {
        if (userSocketMap[socket.id]) {
            delete userSocketMap[socket.id].peerId;
        }
        // Notify others to remove the stream
        socket.in(roomId).emit(ACTIONS.LEAVE_CALL, {
            socketId: socket.id
        });
    });

    // 2. DISCONNECT LOGIC
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id]?.username,
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });

    // CODE AND CHAT SYNC LOGIC
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });
    
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });
    
    socket.on(ACTIONS.SEND_MESSAGE, ({ roomId, message, username, time }) => {
        socket.in(roomId).emit(ACTIONS.RECEIVE_MESSAGE, { username, message, time });
    });
    
    socket.on(ACTIONS.SYNC_OUTPUT, ({ roomId, output }) => {
        io.to(roomId).emit(ACTIONS.SYNC_OUTPUT, { output });
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));