const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Kitkot Games API is running!', version: '0.1.0' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/api/auth/register', (req, res) => {
    res.status(501).json({ message: 'Регистрация — в разработке' });
});

app.post('/api/auth/login', (req, res) => {
    res.status(501).json({ message: 'Вход — в разработке' });
});
app.get('/api/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as now');
        res.json({ status: 'ok', time: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});