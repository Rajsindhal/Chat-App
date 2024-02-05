
const express = require('express');
const http  = require('http');
const port = 9000;
const { Server } = require('socket.io');



const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static('public'));

const users = {};

io.on("connection", socket => {
    socket.on("new-user-joined", name => {
        // console.log("New user joined:", name);
        users[socket.id] = name;
        socket.broadcast.emit("user-joined", name);
    });

    socket.on("send", message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
});


app.get('/', (req, res) => {
    res.sendFile('/public/index.html')
})

server.listen(port, () => {console.log("connected to the port")})