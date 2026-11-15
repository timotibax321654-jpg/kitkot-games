const express = require('express');
const morgan = require('morgan');
const logger = require('./utils/logger');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
const path = require('path');
app.use(express.static(path.join(__dirname, '../client')));

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const sessionRoutes = require('./routes/sessions');
app.use('/api/sessions', sessionRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Kitkot Games API is running!', version: '0.1.0' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as now');
        res.json({ status: 'ok', time: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(err.status || 500).json({ error: 'Внутренняя ошибка сервера' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});

// Обработка непредвиденных ошибок
process.on('uncaughtException', (err) => {
    logger.error('НЕОЖИДАННАЯ ОШИБКА: ' + err.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('НЕОБРАБОТАННЫЙ PROMISE: ' + reason);
});