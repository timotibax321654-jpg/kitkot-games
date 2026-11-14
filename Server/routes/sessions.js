const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 1. СОХРАНИТЬ РЕЗУЛЬТАТ ИГРЫ (ЗАЩИЩЕНО)
// Сюда будет стучаться Unity, когда игрок закончит играть
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { score, coins_collected } = req.body;

        // Валидация на сервере
        if (score === undefined || coins_collected === undefined) {
            return res.status(400).json({ error: 'Не переданы очки (score) или монеты (coins_collected)' });
        }
        if (typeof score !== 'number' || typeof coins_collected !== 'number') {
            return res.status(400).json({ error: 'Очки и монеты должны быть числами' });
        }

        const result = await pool.query(
            'INSERT INTO game_sessions (user_id, score, coins_collected) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, score, coins_collected]
        );

        res.status(201).json({ message: 'Результат сохранен', session: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 2. ПОЛУЧИТЬ ИСТОРИЮ СВОИХ ИГР (ЗАЩИЩЕНО)
router.get('/my-history', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, score, coins_collected, played_at FROM game_sessions WHERE user_id = $1 ORDER BY played_at DESC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;