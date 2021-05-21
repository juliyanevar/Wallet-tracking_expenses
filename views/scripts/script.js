const base_api_path = `${window.location.origin}/`;

function getCode() {
    fetch('http://localhost:3000/registration',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    googleId: document.getElementsByName('googleId')[0].value
                }
            )
        })
        .then(response => response.text())
        .then(view => {
            document.getElementById('message').innerHTML = view;
        }).then(setTimeout(() => {
        document.getElementById('message').innerHTML = "";
    }, 7000));
}

function register() {
    fetch('http://localhost:3000/registration/addUser',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    username: document.getElementsByName('username')[0].value,
                    googleId: document.getElementsByName('googleId')[0].value,
                    code: document.getElementsByName('code')[0].value
                }
            )
        })
        .then(response => response.text())
        .then(view => {
            switch (view) {
                case 'wrong_code':
                    document.getElementById('messageCode').innerHTML = '<p>Wrong code!</p>';
                    break;
                case 'username_exists':
                    document.getElementById('messageUsername').innerHTML = '<p>User with this username already exists!</p>';
                    break;
                default:
                    document.getElementById('content').innerHTML = view;
            }
        }).then(setTimeout(() => {
        document.getElementById('messageCode').innerHTML = "";
        document.getElementById('messageUsername').innerHTML = "";
    }, 7000));
}

function cancel() {
    fetch(base_api_path, {method: 'GET'})
        .then(response => response.text())
        .then(view => document.body.innerHTML = view)
        .then(
            fetch(base_api_path + 'login', {method: 'GET'})
                .then(response => response.text())
                .then(view => {
                    document.getElementById('content').innerHTML = view;
                })
        );
}

function toRegistrationPage() {
    fetch(base_api_path + 'registration', {method: 'GET'})
        .then(response => response.text())
        .then(view => {
            document.getElementById('content').innerHTML = view;
        });
}

window.onload = () => {
    fetch(base_api_path + 'login', {method: 'GET'})
        .then(response => response.text())
        .then(view => {
            document.getElementById('content').innerHTML = view;
        });
}
