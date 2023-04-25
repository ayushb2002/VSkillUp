const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

let RAM = {};

io.on("connection", (socket) => {
    // console.log(`User connected ${socket.id}!`);

    socket.on("join_room", (data) => {
        socket.join(data.roomId);
        socket.broadcast.emit(`receive_message_${data.roomId}`, {user: `${data.user} has joined!`});
        console.log(`${data.user} joined room - ${data.roomId}`);
    });

    socket.on("send_message", (data) => {
        socket.broadcast.emit(`receive_message_${data.roomId}`, data);
        console.log(`${data.roomId} message - ${data.message}`);
    })

    socket.on("disconnectRoom", (data) => {
        socket.broadcast.emit(`receive_message_${data.roomId}`, {user: `${data.user} has left!`});
        socket.leave(data.roomId);
        console.log(`${data.user} left room ${data.roomId}`);
    });

    socket.on("start_game", (data) => {
        socket.broadcast.emit(`trigger_start_${data.roomId}`, data);
        console.log('Game started');
    })

});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});