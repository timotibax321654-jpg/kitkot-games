document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Останавливаем перезагрузку страницы

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorBox = document.getElementById('error-box');

    errorBox.textContent = ''; // Очищаем старые ошибки

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Успех! Сохраняем токен в браузере
            localStorage.setItem('token', data.token);
            alert('Регистрация успешна! Перенаправление...');
            window.location.href = 'profile.html'; // Перекидываем в личный кабинет
        } else {
            // Ошибка от сервера (например, "Пользователь уже существует")
            errorBox.textContent = data.error;
        }
    } catch (err) {
        errorBox.textContent = 'Ошибка подключения к серверу';
    }
});