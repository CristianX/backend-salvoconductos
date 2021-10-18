const express = require('express');
const morgan = require('morgan');

const logger = require('./config/logger');

const app = express();

// Setup middleware
app.use(
    morgan('combined', { stream: { write: (message) => logger.info(message) } })
);

app.get('/', (req, res, next) => {
    res.json({
        message: 'Bienvenido al API de salvoconductos',
    });
});

// No route found handler
app.use((req, res, next) => {
    const message = 'Ruta no encontrada';
    const statusCde = 404;
    logger.warn(message);

    res.status(statusCde);
    res.json({
        message,
    });
});

// Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;

    logger.error(message);

    res.status(statusCode);
    res.json({
        message,
    });
});

module.exports = app;