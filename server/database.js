const mongoose = require('mongoose');

const logger = require('./config/logger');

exports.connect = ({ protocol = 'mongodb', url, username = '', password = '' },
    options = {}
) => {
    let dburl = '';

    // Require auth
    if (username && password) {
        dburl = `${protocol}://${username}:${password}@${url}`;
    } else {
        dburl = `${protocol}://${url}`;
    }

    mongoose.connect(dburl, {
        ...options,
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });

    mongoose.connection.on('open', () => {
        logger.info('Base de datos conectada');
    });

    mongoose.connection.on('close', () => {
        logger.info('Base de datos desconectada');
    });

    mongoose.connection.on('error', (err) => {
        logger.error(`Error en conexiòn con la Base de Datos: ${err}`);
    });

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            logger.info(
                'Conexión a la base de datos desconectada por terminación de la aplicación'
            );
            process.exit(0);
        });
    });
};

exports.disconnect = () => {
    mongoose.connection.close(() => {
        logger.info('Base de Datos desconectada');
    });
};