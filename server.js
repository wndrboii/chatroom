const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);    

//set stetic folder
app.use(express.static(path.join(__dirname, 'public')));
const PORT = 3000 || process.env.PORT;

const botName = 'Admin';

//run when client connects
io.on('connection', socket => {
    socket.emit('message', formatMessage(botName, 'Welcome to ChatRoom'));// singl client
    //broadcast when user connect
    socket.broadcast.emit('message', formatMessage(botName, 'A user just join the ChatRoom'));//all of the clients (!just connetct)
    //io.emit(); //all of the clients

    //run when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user just left the ChatRoom'));
    });

    //listen for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg));  
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));