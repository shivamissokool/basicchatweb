document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    }).then(response => {
        if (response.ok) {
            document.querySelector('.login-container').style.display = 'none';
            document.querySelector('.chat-container').style.display = 'flex';
            setupChat(username);
        } else {
            alert('Login failed');
        }
    });
});

const socket = io();

function setupChat(username) {
    socket.emit('add-user', username);

    document.getElementById('send-button').addEventListener('click', function () {
        const message = document.getElementById('message-input').value;
        socket.emit('message', { username, message });
        document.getElementById('message-input').value = '';
    });

    socket.on('message', function (data) {
        const chatBox = document.getElementById('chat-box');
        const messageElement = document.createElement('div');
        messageElement.textContent = `${data.username}: ${data.message}`;
        chatBox.appendChild(messageElement);
    });

    document.getElementById('add-friend-button').addEventListener('click', function () {
        const friendUsername = document.getElementById('add-friend-input').value;
        socket.emit('add-friend', { username, friendUsername });
        document.getElementById('add-friend-input').value = '';
    });

    socket.on('update-friends-list', function (friends) {
        const friendsList = document.getElementById('friends-list');
        friendsList.innerHTML = '';
        friends.forEach(friend => {
            const friendElement = document.createElement('li');
            friendElement.textContent = friend;
            friendsList.appendChild(friendElement);
        });
    });
}
