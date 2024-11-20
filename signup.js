document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    fetch('https://basicchatweb-production.up.railway.app/signup', { // Update with your Railway backend URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    }).then(response => {
        if (response.ok) {
            alert('Sign up successful, please login.');
            window.location.href = 'login.html';
        } else {
            alert('Sign up failed');
        }
    });
});
