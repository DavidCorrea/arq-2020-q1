const express = require('express');
const router = express.Router();
const { errorResponse } = require('./responses');
const userAuthenticationMiddleware = require('../middlewares/userAuthenticationMiddleware');
const organizationsRepository = require('../repositories/organizationsRepository');

router.use(userAuthenticationMiddleware);

router.route('/organizations')
  .get(async (req, res) => {
    const currentUser = req.currentUser;

    if(currentUser.isAdministrator()) {
      const organizations = await organizationsRepository.findAll();

      res.send(organizations);
    } else {
      errorResponse(res, 403, 'Only administrators can perform this action.');
    }
  });

module.exports = router;
