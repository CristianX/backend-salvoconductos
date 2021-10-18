const express = require('express');
const requestId = require('express-request-id')();

const logger = require('./config/logger');

// Init app
const app = express();

// Setup middleware
app.use(requestId);
app.use(logger.requests);

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