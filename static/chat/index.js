
// focus 'roomInput' when user opens the page
document.querySelector("#nameInput").focus();


// redirect to '/room/<roomInput>/'
document.querySelector("#roomConnect").onclick = function() {
    let roomName = document.querySelector("#roomInput").value;
    let userName = document.querySelector("#nameInput").value;

    if(!roomName || !userName) {
        alert('enter both room and user name')
        return
    }
    window.location.pathname = "chat/" + roomName + '/' + userName  ;
}

// redirect to '/room/<roomSelect>/'
document.querySelector("#roomSelect").onclick = function(){
    let roomName = document.querySelector("#roomSelect").value.split(" (")[0];
    console.log(roomName)
    document.querySelector("#roomInput").value  = roomName ;

}