// backend/src/config/db.config.js

const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/typingspeedtest'; // Change 'yourdbname' to your actual DB name

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
