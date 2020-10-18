const mongoose = require('../conf/db');

module.exports.connectDatabase = async () => {
  await mongoose.connectTestDatabase();
}

module.exports.clearDatabase = async () => {
  await mongoose.clearTestDatabase();
}

module.exports.closeDatabase = async () => {
  await mongoose.closeTestDatabase();
}