const mongoose = require('mongoose');

const leaderboardEntrySchema = new mongoose.Schema({
  name:     { type: String, required: true },
  wpm:      { type: Number, required: true },
  accuracy: { type: Number, required: true },
  date:     { type: Date, default: Date.now },
});

module.exports = mongoose.model('LeaderboardEntry', leaderboardEntrySchema);


