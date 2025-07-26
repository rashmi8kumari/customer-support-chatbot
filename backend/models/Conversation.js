const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  conversation_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  started_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  status: { type: String, enum: ['open', 'closed', 'archived'], default: 'open' },
  tags: [String],
  metadata: {
    source: String,
    language: String
  }
});

module.exports = mongoose.model('Conversation', ConversationSchema);
