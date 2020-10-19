const { validateToken } = require('../../conf/jwt');
const { errorResponse } = require('../routes/responses');
const User = require('../models/user')

const userAuthenticationMiddleware = async (req, res, next) => {
  const token = req.headers.usertoken;
  await new Promise(r => setTimeout(r, Math.random() * (15000 - 500) + 500));

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
