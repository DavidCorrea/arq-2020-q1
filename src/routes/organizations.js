const express = require('express');
const router = express.Router();
const userAuthenticationMiddleware = require('../middlewares/userAuthenticationMiddleware');
const organizationsRepository = require('../repositories/organizationsRepository');

router.use(userAuthenticationMiddleware);

router.route('/organizations')
  .get(async (_, res) => {
    const organizations = await organizationsRepository.findAll();

    res.send(organizations);
  });

module.exports = router;
