const { createLogger, format, transports } = require('winston');

// Setup Logger

const logger = createLogger({
    format: format.simple(),
    transports: [new transports.Console()],
});

module.exports = logger;