const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  conversation_id: { type: String, required: true },
  sender: {
    type: {
      type: String, enum: ['user', 'bot', 'admin'], required: true
    },
    user_id: String,
    name: String
  },
  content: String,
  timestamp: { type: Date, default: Date.now },
  message_type: { type: String, enum: ['text', 'image', 'file', 'audio', 'button'], default: 'text' },
  attachments: [{
    url: String,
    type: String,
    name: String
  }],
  metadata: {
    intent: String,
    confidence: Number,
    language: String
  }
});

module.exports = mongoose.model('Message', MessageSchema);
