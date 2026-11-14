const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    // Получаем токен из заголовка Authorization: Bearer <token>
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Доступ запрещён. Токен отсутствует.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Сохраняем данные пользователя в req
        next(); // Передаём управление дальше (к маршруту)
    } catch (err) {
        res.status(401).json({ error: 'Неверный или истёкший токен' });
    }
};