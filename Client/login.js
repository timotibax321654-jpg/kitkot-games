document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Останавливаем перезагрузку страницы

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Находим кнопку отправки, чтобы менять её состояние
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    // Меняем текст кнопки на время загрузки
    submitBtn.textContent = 'Загрузка...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Сохраняем токен
            localStorage.setItem('token', data.token);
            
            // Показываем красивое уведомление об успехе
            showToast('Вход выполнен успешно!', 'success');
            
            // Задерживаем переход на 1 секунду, чтобы пользователь успел увидеть уведомление
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1000);
        } else {
            // Показываем красивое уведомление об ошибке
            showToast(data.error, 'error');
            
            // Возвращаем кнопку в исходное состояние
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    } catch (err) {
        showToast('Ошибка подключения к серверу', 'error');
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});