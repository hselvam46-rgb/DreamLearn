const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log(`Connecting to configured MongoDB at ${uri}...`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('MongoDB connected successfully via MONGODB_URI.');
      return;
    } catch (err) {
      console.warn(`Could not connect to configured MONGODB_URI: ${err.message}. Falling back to embedded MongoMemoryServer...`);
    }
  }

  try {
    const path = require('path');
    const fs = require('fs');
    const os = require('os');
    const dataDir = path.join(os.tmpdir(), 'dreamlearn_mongo_' + Date.now());
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    console.log('Starting embedded MongoDB instance (MongoMemoryServer)...');
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'dreamlearn',
        dbPath: dataDir,
      },
    });
    const memoryUri = mongoServer.getUri();
    await mongoose.connect(memoryUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`Embedded MongoDB connected successfully at ${memoryUri}`);
  } catch (memErr) {
    console.error('Failed to initialize embedded MongoDB:', memErr.message);
    throw memErr;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('MongoDB disconnected.');
  } catch (err) {
    console.error('Error during MongoDB disconnect:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
