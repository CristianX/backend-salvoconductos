const express = require('express');
const requestId = require('express-request-id')();
const bodyParser = require('body-parser');

const logger = require('./config/logger');
const api = require('./api/v1');

// Init app
const app = express();

// Setup middleware
app.use(requestId);
app.use(logger.requests);

// parse application/x-www-form-underlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Setup router and routes
app.use('/api', api); //Version final del API
app.use('/api/v1', api);

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
    const { message, level = 'error' } = err;
    let { statusCode = 500 } = err;
    const log = `${logger.header(req)} ${statusCode} ${message}`;

    // Validations Errors
    if (err.message.startsWith('ValidationError')) {
        statusCode = 422;
    }

    logger[level](log);

    res.status(statusCode);
    res.json({
        error: true,
        statusCode,
        message,
    });
});

module.exports = app;