const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);    

//set stetic folder
app.use(express.static(path.join(__dirname, 'public')));
const PORT = 3000 || process.env.PORT;

const botName = 'Admin';

//run when client connects
io.on('connection', socket => {
    socket.on('joinRoom',({username, room}) => {

        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', formatMessage(botName, 'Welcome to ChatRoom'));// singl client
        //broadcast when user connect
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} just join the ChatRoom`));//all of the clients (!just connetct)
        //io.emit(); //all of the clients

        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });
    //listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));  
    });

    //run when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} just left the ChatRoom`));
            
            //send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));