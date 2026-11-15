const winston = require('winston');
const path = require('path');

// Настраиваем формат вывода (дата + сообщение)
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        // 1. Вывод в консоль (для нас, пока мы разрабатываем)
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // 2. Запись ошибок в файл error.log
        new winston.transports.File({ 
            filename: path.join(__dirname, '../error.log'), 
            level: 'error' 
        }),
        // 3. Запись всех событий в файл combined.log
        new winston.transports.File({ 
            filename: path.join(__dirname, '../combined.log') 
        })
    ]
});

module.exports = logger;