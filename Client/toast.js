// Функция для создания контейнера, если его нет
function getToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

// Главная функция показа уведомлений
function showToast(message, type = 'success') {
    const container = getToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Иконка в зависимости от типа
    const icon = type === 'success' ? '✅' : '❌';
    toast.innerHTML = `<span style="margin-right: 10px; font-size: 18px;">${icon}</span> <span>${message}</span>`;
    
    container.appendChild(toast);

    // Автоматическое удаление через 3 секунды
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}