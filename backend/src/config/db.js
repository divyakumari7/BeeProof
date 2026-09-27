const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');

let mongod = null;

async function connectDB() {
  const customUri = process.env.MONGODB_URI;

  if (customUri) {
    try {
      console.log(`Connecting to specified MongoDB URI: ${customUri}`);
      await mongoose.connect(customUri, { serverSelectionTimeoutMS: 3000 });
      console.log('✅ Connected to external MongoDB successfully.');
      return;
    } catch (err) {
      console.warn(`⚠️ Failed to connect to ${customUri}: ${err.message}. Falling back to embedded persistent database.`);
    }
  }

  // Try standard local MongoDB default
  try {
    const defaultLocalUri = 'mongodb://127.0.0.1:27017/beeproof';
    await mongoose.connect(defaultLocalUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`✅ Connected to local MongoDB at ${defaultLocalUri}`);
    return;
  } catch (err) {
    console.log('Local MongoDB not running on 27017. Initializing embedded resilient MongoDB engine...');
  }

  // Resilient Embedded Mongo Engine with disk persistence
  try {
    const dbPath = path.join(__dirname, '../../data/mongo-storage');
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    } else {
      // Clean up stale lock files from previous unclean process exit
      try {
        const lockFile = path.join(dbPath, 'mongod.lock');
        const wtLock = path.join(dbPath, 'WiredTiger.lock');
        if (fs.existsSync(lockFile)) fs.unlinkSync(lockFile);
        if (fs.existsSync(wtLock)) fs.unlinkSync(wtLock);
      } catch (lockErr) {
        // If file is held by another process, proceed to let MongoMemoryServer handle
      }
    }

    mongod = await MongoMemoryServer.create({
      instance: {
        dbPath: dbPath,
        storageEngine: 'wiredTiger'
      }
    });

    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`✅ Resilient MongoDB engine running & connected at ${uri}`);
  } catch (embeddedErr) {
    console.warn(`Embedded persistent engine init warning: ${embeddedErr.message}. Starting in-memory fallback.`);
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`✅ Connected to in-memory MongoDB at ${uri}`);
  }
}

async function closeDB() {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
}

module.exports = { connectDB, closeDB };
