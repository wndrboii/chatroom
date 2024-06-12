const chatRoom = document.getElementById('chat-form');

const socket = io();

socket.on('message', message => {//message from server
    console.log(message);
    outputMessage(message);
})

//message submit
chatRoom.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;//get message text

    socket.emit('chatMessage', msg);//emit message to the server
});

//output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">
        ${message}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}