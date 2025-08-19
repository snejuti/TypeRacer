const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  name: String,
  wpm: Number,
  accuracy: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LeaderboardEntry', leaderboardSchema);
