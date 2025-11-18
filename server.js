
require('dotenv').config();

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { TikTokConnectionWrapper, getGlobalConnectionCount } = require('./connectionWrapper');
const { clientBlocked } = require('./limiter');

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 8081;

const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    let tiktokConnectionWrapper;

    console.log(`Client connected: ${socket.id}`);

    socket.on('setUniqueId', (uniqueId, options) => {
        // Handle simulation mode
        if (uniqueId.startsWith('sim_')) {
            console.log(`Simulating connection for @${uniqueId} from ${socket.id}.`);
            setTimeout(() => {
                socket.emit('tiktokConnected', { roomId: `SIMULATED_ROOM_${uniqueId}` });
            }, 1000);
            return;
        }

        // Prohibit the client from specifying certain options for security
        if (typeof options === 'object' && options) {
            delete options.requestOptions;
            delete options.websocketOptions;
        } else {
            options = {};
        }

        // Optional session ID from .env file
        if (process.env.SESSIONID) {
            options.sessionId = process.env.SESSIONID;
            console.info('Using SessionId from .env file');
        }

        // Rate limiting
        if (process.env.ENABLE_RATE_LIMIT && clientBlocked(io, socket)) {
            socket.emit('tiktokDisconnected', 'Rate limit exceeded. Please try again later.');
            return;
        }

        // Attempt a real connection to TikTok
        try {
            tiktokConnectionWrapper = new TikTokConnectionWrapper(uniqueId, options, true);
            tiktokConnectionWrapper.connect();
        } catch (err) {
            socket.emit('tiktokDisconnected', err.toString());
            return;
        }

        // Forward events from the wrapper to the client
        tiktokConnectionWrapper.once('connected', state => socket.emit('tiktokConnected', state));
        tiktokConnectionWrapper.once('disconnected', reason => socket.emit('tiktokDisconnected', reason));

        tiktokConnectionWrapper.connection.on('streamEnd', () => socket.emit('streamEnd'));
        tiktokConnectionWrapper.connection.on('roomUser', msg => socket.emit('roomUser', msg));
        tiktokConnectionWrapper.connection.on('member', msg => socket.emit('member', msg));
        tiktokConnectionWrapper.connection.on('chat', msg => socket.emit('chat', msg));
        tiktokConnectionWrapper.connection.on('gift', msg => socket.emit('gift', msg));
        tiktokConnectionWrapper.connection.on('social', msg => socket.emit('social', msg));
        tiktokConnectionWrapper.connection.on('like', msg => socket.emit('like', msg));
    });
    
    // Listener for the simulator panel
    socket.on('simulation-event', (data) => {
        console.log(`Received simulation-event from ${socket.id}, broadcasting type: ${data.type}`);
        socket.broadcast.emit(data.type, data.payload); // Emit directly to the event type
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        if (tiktokConnectionWrapper) {
            tiktokConnectionWrapper.disconnect();
        }
    });
});

// Global connection statistics emitter (optional but good for monitoring)
setInterval(() => {
    io.emit('statistic', { globalConnectionCount: getGlobalConnectionCount() });
}, 5000);

httpServer.listen(PORT, () => {
    console.log(`Server running for Katla on http://localhost:${PORT}`);
});
