const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

const router = express.Router();

// 1. READ: получить всех пользователей
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, email, created_at FROM users ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. READ: получить свой профиль (ЗАЩИЩЕНО)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, username, email, created_at FROM users WHERE id = $1',
            [req.user.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 3. READ: получить одного пользователя по ID
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, username, email, created_at FROM users WHERE id = $1',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 4. UPDATE: смена пароля (ЗАЩИЩЕНО)
router.put('/password', authMiddleware, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Введите старый и новый пароль' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Новый пароль должен быть минимум 6 символов' });
        }

        const user = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
        const validPassword = await bcrypt.compare(oldPassword, user.rows[0].password_hash);
        
        if (!validPassword) {
            return res.status(400).json({ error: 'Старый пароль неверен' });
        }

        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newPasswordHash, req.user.id]);

        res.json({ message: 'Пароль успешно изменён' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 5. DELETE: удалить пользователя
router.delete('/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.json({ message: 'Пользователь удален', id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;