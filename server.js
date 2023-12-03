//import { socket, loginPage, chatPage, userList, renderUserList } from "./public/main";

const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

server.listen(3000);


app.use(express.static(path.join(__dirname, 'public')));

let connecteUsers = [];

io.on('connection', (socket) => {
    console.log("Conexão detectada...")

    socket.on('join-request', (username) => {
        socket.username = username;
        connecteUsers.push(username);
        console.log(connecteUsers);

        socket.emit('user-ok', connecteUsers);
        socket.broadcast.emit('list-update', {
            joined: username,
            list: connecteUsers
        });
    });

    socket.on('disconnect', () => {
        connecteUsers = connecteUsers.filter(u => u != socket.username);
        console.log(connecteUsers);

        socket.broadcast.emit('list-update', {
            left: socket.username,
            list: connecteUsers
        });
    });

    socket.on('send-msg', (txt) => {
        let obj = {
            username: socket.username,
            message: txt
        };

        //socket.emit('show-msg', obj);
        socket.broadcast.emit('show-msg', obj);
    });

});
