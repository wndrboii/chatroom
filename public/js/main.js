const chatRoom = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');

const socket = io();

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