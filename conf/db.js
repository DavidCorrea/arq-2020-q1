const mongoose = require('mongoose');
const mongooseOpts = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };

const setupTestDB = () => {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongoMemoryServer = new MongoMemoryServer();

  mongoose.connectTestDatabase = async () => {
    const uri = await mongoMemoryServer.getUri();
    mongoose.connect(uri, mongooseOpts);
  };

  mongoose.clearTestDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  }

  mongoose.closeTestDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoMemoryServer.stop();
  }
};

const setupProdDB = () => {
  mongoose.connect(process.env.MONGODB_URI, mongooseOpts);
};

const setupDevDB = () => {
  mongoose.connect('mongodb://mongo:27017/dev', mongooseOpts);
};

switch(process.env.NODE_ENV) {
  case ('test'):
    setupTestDB();
    break;
  case ('production'):
    setupProdDB();
    break;
  default:
    setupDevDB();
}

module.exports = mongoose;
