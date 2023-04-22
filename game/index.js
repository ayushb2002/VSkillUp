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

io.on("connection", (socket) => {
    // console.log(`User connected ${socket.id}!`);

    // socket.on("send_message", (data) => {
    //     console.log(data);
    //     socket.broadcast.emit("receive_message", data);
    // });

    socket.on("join_room", (data) => {
        socket.join(data);

        socket.emit("success_join_room", {status: true});
        socket.broadcast.emit("user_joined_room", {user:data.user});
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});