// login-status.js

document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const addAdButton = document.getElementById('addAdButton');
    
    function updateUIForAuthStatus() {
        const token = localStorage.getItem('token');
        
        if (token) {
            loginButton.style.display = 'none';
            logoutButton.style.display = 'block';
            if (addAdButton) {
                addAdButton.style.display = 'block';
            }
        } else {
            loginButton.style.display = 'block';
            logoutButton.style.display = 'none';
            if (addAdButton) {
                addAdButton.style.display = 'none';
            }
        }
    }

    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        updateUIForAuthStatus();
        window.location.href = './home.html';
    });

    updateUIForAuthStatus();
});