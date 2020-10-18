const express = require('express');
const router = express.Router();
const userAuthenticationMiddleware = require('../middlewares/userAuthenticationMiddleware');
const { creationResponse, errorResponse } = require('./responses');
const User = require('../models/user');
const usersRepository = require('../repositories/usersRepository');

router.use(userAuthenticationMiddleware);

router.route('/users')
  .get(async (req, res) => {
    const currentUser = req.currentUser;

    if(currentUser.isAdministrator()) {
      const users = await usersRepository.findAll();

      res.send(users);
    } else {
      errorResponse(res, 403, 'Only administrators can perform this action.');
    }
  })
  .post(async (req, res) => {
    const currentUser = req.currentUser;

    if(currentUser.isAdministrator()) {
      await usersRepository.create(new User(req.body));

      creationResponse(res, 'Usuario creado');
    } else {
      errorResponse(res, 403, 'Only administrators can perform this action.');
    }
  });

module.exports = router;
