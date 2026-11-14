const token = localStorage.getItem('token');

// Если токена нет — выкидываем на страницу входа
if (!token) {
    alert('Вы не авторизованы!');
    window.location.href = 'login.html';
}


async function loadProfile() {
    try {
        const response = await fetch('/api/users/me', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return;
        }

        const user = await response.json();
        
        // Отображаем данные
        document.getElementById('user-info').innerHTML = `
            <p><strong>ID:</strong> ${user.id}</p>
            <p><strong>Имя пользователя:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Дата регистрации:</strong> ${new Date(user.created_at).toLocaleDateString('ru-RU')}</p>
        `;
    } catch (err) {
        document.getElementById('user-info').innerHTML = '<p style="color:#e74c3c">Ошибка загрузки профиля</p>';
    }
}
loadProfile();
document.getElementById('password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const errorBox = document.getElementById('pass-error');
    const successBox = document.getElementById('pass-success');

    errorBox.textContent = '';
    successBox.textContent = '';

    try {
        const response = await fetch('/api/users/password', {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token 
            },
            body: JSON.stringify({ oldPassword, newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            successBox.textContent = data.message; // "Пароль успешно изменён"
            document.getElementById('password-form').reset();
        } else {
            errorBox.textContent = data.error;
        }
    } catch (err) {
        errorBox.textContent = 'Ошибка подключения';
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token'); // Удаляем токен
    window.location.href = 'index.html'; // На главную
});

// 4. ЗАГРУЗКА ИСТОРИИ ИГР
async function loadHistory() {
    const historyContainer = document.getElementById('history-container');
    try {
        const response = await fetch('/api/sessions/my-history', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const history = await response.json();

        if (history.length === 0) {
            historyContainer.innerHTML = '<p>Вы еще не играли.</p>';
            return;
        }

        let html = '<ul style="list-style: none; padding: 0;">';
        history.forEach(game => {
            const date = new Date(game.played_at).toLocaleString('ru-RU');
            html += `
                <li style="border-bottom: 1px solid #1a1a2e; padding: 10px 0;">
                    🎮 Очки: <strong>${game.score}</strong> | 🪙 Монеты: <strong>${game.coins_collected}</strong> 
                    <br><span style="font-size: 12px; color: #a0a0a0;">Дата: ${date}</span>
                </li>
            `;
        });
        html += '</ul>';
        historyContainer.innerHTML = html;

    } catch (err) {
        historyContainer.innerHTML = '<p style="color: #e74c3c;">Ошибка загрузки истории</p>';
    }
}

// Вызываем функцию при загрузке страницы
loadHistory();