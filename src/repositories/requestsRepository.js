const mongoose = require('../../conf/db');
const Request = require('../models/request');

const RequestModel = mongoose.model('Request', 
  new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    area: String,
    supply: String,
    state: String,
    reviewedBy: String,
    rejectionReason: String,
    provider: String,
  }
));

class RequestsRepository {
  constructor() {}

  async create({ userId, area, supply, state }) {
    return RequestModel.create({ userId, area, supply, state });
  }

  findAll() {
    return RequestModel.find({});
  }

  async findAllByUserId(userId) {
    return RequestModel.find({ userId }).exec();
  }

  async findByIdAndUserId(id, userId) {
    return RequestModel.findOne({ _id: id, userId }).exec();
  }

  async findById(id) {
    return RequestModel.findOne({ _id: id }).exec();
  }

  async cancel(id, userId) {
    return RequestModel
      .findOneAndUpdate({ _id: id, userId },
        { state: Request.STATES.CANCELLED },
        { new: true }).exec();
  }

  async approve(id, userId, provider) {
    return RequestModel
      .findOneAndUpdate({ _id: id },
        { state: Request.STATES.APPROVED, provider, reviewedBy: userId },
        { new: true }).exec();
  }

  async reject(id, userId, rejectionReason) {
    return RequestModel
      .findOneAndUpdate({ _id: id },
        { state: Request.STATES.REJECTED, rejectionReason, reviewedBy: userId },
        { new: true }).exec();
  }

  async count() {
    return await RequestModel.countDocuments();
  }
}

const instance = new RequestsRepository();
module.exports = instance;
