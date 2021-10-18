const express = require('express');
const requestId = require('express-request-id')();

const logger = require('./config/logger');
const api = require('./api');

// Init app
const app = express();

// Setup middleware
app.use(requestId);
app.use(logger.requests);

// Setup router and routes
app.use('/api', api);

app.get('/', (req, res, next) => {
    res.json({
        message: 'Bienvenido al API de salvoconductos',
    });
});

// app.route('/api/usuarios').get((req, res, next) => {
//     res.json({
//         message: 'Lista de usuarios',
//     });
// });

// No route found handler
app.use((req, res, next) => {
    next({
        message: 'Ruta no encontrada',
        statusCde: 404,
        level: 'warn',
    });
});

// Error handler
app.use((err, req, res, next) => {
    const { message, statusCode = 500, level = 'error' } = err;
    const log = `${logger.header(req)} ${statusCode} ${message}`;

    logger[level](log);

    res.status(statusCode);
    res.json({
        message,
    });
});

module.exports = app;