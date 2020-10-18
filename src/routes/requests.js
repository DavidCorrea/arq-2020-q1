const express = require('express');
const router = express.Router();
const userAuthenticationMiddleware = require('../middlewares/userAuthenticationMiddleware');
const { creationResponse, editResponse, errorResponse } = require('./responses');
const requestsRepository = require('../repositories/requestsRepository');
const Request = require('../models/request');

router.use(userAuthenticationMiddleware);

router.route('/requests')
  .get(async (req, res) => {
    const currentUser = req.currentUser;

    const requests = currentUser.isAdministrator() ?
      await requestsRepository.findAll() :
      await requestsRepository.findAllByUserId(currentUser._id);

    res.send(requests);
  })
  .post(async (req, res) => {
    const currentUser = req.currentUser;
    const newRequest = new Request({ userId: currentUser._id, ...req.body});
    await requestsRepository.create(newRequest);

    creationResponse(res, 'Created new request.');
  });

router.route('/requests/:id/cancel')
  .patch(async (req, res) => {
    const requestId = req.params.id;
    const currentUser = req.currentUser;
    const request = await requestsRepository.findByIdAndUserId(requestId, currentUser._id);

    if(request) {
      await requestsRepository.cancel(requestId, currentUser._id);

      editResponse(res, 'Request has been cancelled.');
    } else {
      errorResponse(res, 404, 'Request could not be cancelled.');
    }
  });

router.route('/requests/:id/approve')
  .patch(async (req, res) => {
    const currentUser = req.currentUser;

    if(currentUser.isAdministrator()) {
      const requestId = req.params.id;
      const request = await requestsRepository.findById(requestId);

      if(request) {
        const { provider } = req.body;
        await requestsRepository.approve(requestId, currentUser._id, provider);
  
        editResponse(res,'Request has been approved.');
      } else {
        errorResponse(res, 404, 'Request could not be approved.');
      }
    } else {
      errorResponse(res, 403, 'Only administrators can perform this action.');
    }
  });

router.route('/requests/:id/reject')
  .patch(async (req, res) => {
    const currentUser = req.currentUser;

    if(currentUser.isAdministrator()) {
      const requestId = req.params.id;
      const request = await requestsRepository.findById(requestId);

      if(request) {
        const { rejectionReason } = req.body;
        await requestsRepository.reject(requestId, currentUser._id, rejectionReason);
  
        editResponse(res,'Request has been rejected.');
      } else {
        errorResponse(res, 404, 'Request could not be rejected.');
      }
    } else {
      errorResponse(res, 403, 'Only administrators can perform this action.');
    }
  });

module.exports = router;
