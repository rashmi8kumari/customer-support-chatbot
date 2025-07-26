const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  user_id: String,
  session_id: String,
  context: Object,
  created_at: { type: Date, default: Date.now },
  expires_at: Date
});

module.exports = mongoose.model('Session', SessionSchema);
