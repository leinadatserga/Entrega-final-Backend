const socket = io ();

const chatName = document.getElementById ( "chatName" );
const chat = document.getElementById ( "chat" );
let chatUser
const chatSend = document.getElementById ( "chatSend" );
const chatMessages = document.getElementById ( "chatMessages" );
const chatField = document.getElementById ( "chatField" );


chatSend.addEventListener ( "click", () => {
    let timeStamp = new Date ().toLocaleString ();
    if ( chatField.value.trim().length > 0 ) {
        chatName.value ? chatUser = chatName.value : chatUser = "ejemplo@mail.com";
        socket.emit ( "message", { time: timeStamp, email: chatUser, message: chatField.value });
        chatField.value = "";
        chatUser = chatName.value;
    } 
});


socket.on ( "showMessages", showMessages => {
    chatMessages.innerHTML = "";
    showMessages.forEach ( message => {
        chatMessages.innerHTML += `<p>${ message.time } : <b>${ message.email }</b> escribió: ${ message.message }</p>` 
    });
})

 