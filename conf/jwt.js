const dotEnv = process.env.NODE_ENV === 'production' ? process.env : require('dotenv').config().parsed;
const jwt = require('jsonwebtoken');

module.exports = {
  tokenForUser: (user) => {
    return jwt.sign(JSON.stringify(user), dotEnv.JWT_TOKEN);
  },

  validateToken: (token, onSuccess, onError) => {
    jwt.verify(token, dotEnv.JWT_TOKEN, (error, decoded) => {
      if(error) {
        onError();
      } else {
        onSuccess(decoded);
      }
    });
  }
};
