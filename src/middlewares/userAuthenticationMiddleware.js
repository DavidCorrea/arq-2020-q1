const { validateToken } = require('../../conf/jwt');
const { errorResponse } = require('../routes/responses');
const User = require('../models/user')

const userAuthenticationMiddleware = (req, res, next) => {
  const token = req.headers.usertoken;

  if(token) {
    validateToken(token, (decodedToken) => {
      req.currentUser = new User(decodedToken);
      next();
    }, () => {
      errorResponse(res, 401, 'Invalid token.');
    });
  } else {
    errorResponse(res, 401, 'Token not found.');
  }
}

module.exports = userAuthenticationMiddleware;
