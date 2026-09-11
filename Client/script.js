// Проверка связи с сервером
async function checkServer() {
    const statusDiv = document.getElementById('server-status');
    try {
        const response = await fetch('http://localhost:3000/api/health');
        const data = await response.json();
        statusDiv.textContent = 'Сервер работает!';
        statusDiv.className = 'ok';
    } catch (err) {
        statusDiv.textContent = 'Сервер недоступен';
        statusDiv.className = 'error';
    }
}
checkServer();