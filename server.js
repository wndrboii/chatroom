const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);    

//set stetic folder
app.use(express.static(path.join(__dirname, 'public')));
const PORT = 3000 || process.env.PORT;

//run when client connects
io.on('connection', socket => {
    console.log('New WS Connection...');
});

server.listen(PORT, () => console.log('Server running on port ${PORT}'));