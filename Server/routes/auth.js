const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const router = express.Router();

// === РЕГИСТРАЦИЯ ===
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Валидация (проверка входящих данных)
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Все поля обязательны (username, email, password)' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Пароль должен быть минимум 6 символов' });
        }

        // 2. Проверка, что пользователь не существует
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Пользователь с таким email или username уже существует' });
        }

        // 3. Хеширование пароля
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 4. Сохранение в БД
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
            [username, email, passwordHash]
        );

        // 5. Генерация JWT-токена
        const token = jwt.sign(
            { id: newUser.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Регистрация успешна',
            token,
            user: newUser.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});
// === ВХОД (ЛОГИН) ===
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Валидация
        if (!email || !password) {
            return res.status(400).json({ error: 'Введите email и пароль' });
        }

        // 2. Поиск пользователя
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Неверный email или пароль' });
        }

        // 3. Проверка пароля
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Неверный email или пароль' });
        }

        // 4. Генерация JWT-токена
        const token = jwt.sign(
            { id: user.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Вход выполнен',
            token,
            user: {
                id: user.rows[0].id,
                username: user.rows[0].username,
                email: user.rows[0].email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;