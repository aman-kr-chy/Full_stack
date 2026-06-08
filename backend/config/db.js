const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Make sure MongoDB is running: mongod');
    // Don't exit, allow app to run without DB for now
    // process.exit(1);
  }
};

module.exports = connectDB;
