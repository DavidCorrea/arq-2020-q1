const logger = require('../../conf/logger');

const creationResponse = (response, log) => {
  logger.appInfo(log);
  response.status(201);
  response.send({});
};

const editResponse = (response, log) => {
  logger.appInfo(log);
  response.status(200);
  response.send({});
};

const errorResponse = (response, status, log) => {
  logger.appWarn(log);
  response.status(status);
  response.send(log);
};

module.exports = {
  creationResponse,
  editResponse,
  errorResponse
};
