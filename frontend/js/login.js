// login.js

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); 
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
  
        if (!response.ok) {
            throw new Error('Erro no login, verifique as credenciais.');
        }
  
        const data = await response.json();
  
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId); // Supondo que o backend retorne o userId

        window.location.href = 'home.html'; 
    } catch (error) {
        alert(error.message);
    }
});