const tableBody = document.getElementById('table-body');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const searchBtn = document.getElementById('search-btn');

// 1. Сначала объявляем функцию загрузки данных
async function loadUsers() {
    const search = searchInput.value.trim();
    const sort = sortSelect.value;

    let url = `/api/users?sort=${sort}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }

    try {
        const response = await fetch(url);
        const users = await response.json();

        tableBody.innerHTML = ''; 

        if (users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3" style="padding: 12px; text-align: center;">Пользователи не найдены</td></tr>';
            return;
        }

        users.forEach(user => {
            const date = new Date(user.created_at).toLocaleDateString('ru-RU');
            const row = `
                <tr style="border-bottom: 1px solid #1a1a2e;">
                    <td style="padding: 12px;">${user.id}</td>
                    <td style="padding: 12px; font-weight: bold; color: #e94560;">${user.username}</td>
                    <td style="padding: 12px;">${date}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (err) {
        tableBody.innerHTML = '<tr><td colspan="3" style="padding: 12px; text-align: center; color: #e74c3c;">Ошибка загрузки данных</td></tr>';
    }
}

// 2. Теперь, когда функция создана, вешаем обработчики
searchBtn.addEventListener('click', loadUsers);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loadUsers();
    }
});

sortSelect.addEventListener('change', loadUsers);

// 3. И запускаем её первый раз при загрузке страницы
loadUsers();