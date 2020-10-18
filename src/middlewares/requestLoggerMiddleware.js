const logger = require('../../conf/logger');

const requestLoggerMiddleware = (req, _, next) => {
  const shouldLogBody = ['POST', 'PATCH', 'PUT'].includes(req.method);

  logger.requestInfo(`${req.method} ${req.originalUrl} ${shouldLogBody ? JSON.stringify(req.body) : ''}`);
  next();
}

module.exports = requestLoggerMiddleware;
