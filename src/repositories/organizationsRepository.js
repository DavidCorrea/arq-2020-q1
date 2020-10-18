const mongoose = require('../../conf/db');

const OrganizationModel = mongoose.model('Organization', 
  new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    locality: String,
    supplies: [String],
  }
));

class OrganizationsRepository {
  constructor() {}

  async create({ name, email, phoneNumber, locality, supplies }) {
    return OrganizationModel.create({ name, email, phoneNumber, locality, supplies });
  }

  findAll() {
    return OrganizationModel.find({});
  }

  async findByEmail(email) {
    return OrganizationModel.findOne({ email }).exec();
  }
}

const instance = new OrganizationsRepository();
module.exports = instance;
