const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000 || process.env.PORT;
const botName = 'Admin';

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', async ({ username, room }) => {
        const user = await userJoin(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', formatMessage(botName, 'Welcome to ChatRoom'));// single client
        // Broadcast when user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} just joined the ChatRoom`));// all of the clients (!just connected)
        // io.emit(); // all of the clients

        // Send users and room info
        const users = await getRoomUsers(user.room);
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', async msg => {
        const user = await getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Run when client disconnects
    socket.on('disconnect', async () => {
        const user = await userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} just left the ChatRoom`));
            
            // Send users and room info
            const users = await getRoomUsers(user.room);
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users
            });
        }
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
