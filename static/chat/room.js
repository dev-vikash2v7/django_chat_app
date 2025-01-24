

const roomName = JSON.parse(document.getElementById('roomName').textContent);
const userName = JSON.parse(document.getElementById('userName').textContent);


let chatLog = document.querySelector("#chatLog");
let chatMessageInput = document.querySelector("#chatMessageInput");
let chatMessageSend = document.querySelector("#chatMessageSend");
let onlineUsersSelector = document.querySelector("#onlineUsersSelector");


function addMessageToChatLog(sender, message, isSender) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message");
    messageContainer.classList.add(isSender ? "sender" : "receiver");

    const messageText = document.createElement("p");
    messageText.textContent = message;

    const senderName = document.createElement("span");
    senderName.textContent = isSender ? "You" : sender;
    senderName.classList.add("sender-name");

    messageContainer.appendChild(senderName);
    messageContainer.appendChild(messageText);
    chatLog.appendChild(messageContainer);


    chatLog.scrollTop = chatLog.scrollHeight;
}

function onlineUsersSelectorAdd(value) {
    
    if (document.querySelector("option[value='" + value + "']")) return;

    let newOption = document.createElement("option");
    newOption.value = value;
    newOption.innerHTML = value;
    onlineUsersSelector.appendChild(newOption);
}

function onlineUsersSelectorRemove(value) {
    let oldOption = document.querySelector("option[value='" + value + "']");
    if (oldOption !== null) oldOption.remove();
}

chatMessageInput.focus();

// submit if the user presses the enter key
chatMessageInput.onkeyup = function(e) {
    if (e.keyCode === 13) {  
        chatMessageSend.click();
    }
};




chatMessageSend.onclick = function() {
    if (chatMessageInput.value.length === 0) return;
    
    chatSocket.send(JSON.stringify({
        "command" : 'chat_message' , 
        "message": chatMessageInput.value,
        "user_name": userName,
        "room_name": roomName,
    }));
    chatMessageInput.value = "";
};



let chatSocket = null;

function connect() {
    
    const protocol = location.protocol == 'http:' ? 'ws://' : 'wss://';

    chatSocket = new WebSocket(protocol + window.location.host + "/ws/chat/" + roomName  + '/' + userName);

    
    chatSocket.onopen = function(e) {
        console.log("Successfully connected to the WebSocket.");
    }

    chatSocket.onclose = function(e) {
        console.log("WebSocket connection closed unexpectedly. Trying to reconnect in 2s..." , e);
        setTimeout(function() {
            console.log("Reconnecting...");
            connect();
        }, 10000);
    };


    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);

        switch (data.type) {
            case "chat_message":

                addMessageToChatLog(
                    data.user_name,
                    data.message,
                    data.user_name === userName
                );
                break;

            case "user_list":
                console.log(data.users)
                    if(data.users.length == 1){
                        let newOption = document.createElement("option");
                        newOption.value = "empty";
                        newOption.innerHTML = "No users active currently";
                        onlineUsersSelector.appendChild(newOption);
                        break;
                    }
                    for (let i = 0; i < data.users.length; i++) {
                        if(data.users[i] != userName)
                            onlineUsersSelectorAdd(data.users[i]);
                    }

                    break;

            case "user_join":
                console.log(data.user_name , userName)
                if( data.user_name != userName  ){
                 alert(data.user_name + " is joined the room")
                 onlineUsersSelectorAdd(data.user_name);
                 onlineUsersSelectorRemove('empty');
                }

                break;

            case "user_leave":
                    chatLog.value += data.user + " left the room.\n";
                    onlineUsersSelectorRemove(data.user);
                    break;
            default:
                console.error("Unknown message type!");
                break;
        }

        chatLog.scrollTop = chatLog.scrollHeight;
    };

    chatSocket.onerror = function(err) {
        console.log("WebSocket encountered an error: "  , err);
        console.log("Closing the socket.");
        chatSocket.close();
    }
}

connect();
