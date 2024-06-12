const chatRoom = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users'); 

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();
//join chatroom
socket.emit('joinRoom', {username, room});

//get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})
socket.on('message', message => {//message from server
    console.log(message);
    outputMessage(message);
    chatMessage.scrollTop = chatMessage.scrollHeight;
})

//message submit
chatRoom.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;//get message text

    socket.emit('chatMessage', msg);//emit message to the server

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


//add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//add users to DOM
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;

}