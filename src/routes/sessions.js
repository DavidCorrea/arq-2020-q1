const express = require('express');
const router = express.Router();
const logger = require('../../conf/logger');
const { tokenForUser } = require('../../conf/jwt');
const { errorResponse } = require('./responses');
const UsersRepository = require('../repositories/usersRepository');

router.route('/sessions')
  .post(async ({ body: { email }}, res) => {
    logger.appInfo(`Logging ${email} in...`);

    const user = await UsersRepository.findByEmail(email);

    if(user) {
      logger.appInfo(`${email} has logged in.`);
      
      res.send({ token: tokenForUser(user) });
    } else {
      errorResponse(res, 404, `${email} has not been able to log in.`);
    }
  });

module.exports = router;
