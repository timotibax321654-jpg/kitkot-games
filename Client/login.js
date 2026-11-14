document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorBox = document.getElementById('error-box');

    errorBox.textContent = '';

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Сохраняем токен и переходим в профиль
            localStorage.setItem('token', data.token);
            window.location.href = 'profile.html';
        } else {
            errorBox.textContent = data.error;
        }
    } catch (err) {
        errorBox.textContent = 'Ошибка подключения к серверу';
    }
});