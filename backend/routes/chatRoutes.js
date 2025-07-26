const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start a new conversation
router.post('/conversations', async (req, res) => {
  try {
    const convo = await Conversation.create(req.body);
    res.json(convo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a message to a conversation
router.post('/messages', async (req, res) => {
  try {
    const msg = await Message.create(req.body);
    await Conversation.updateOne(
      { conversation_id: req.body.conversation_id },
      { $set: { last_updated: new Date() } }
    );
    res.json(msg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all messages of a conversation
router.get('/messages/:conversation_id', async (req, res) => {
  try {
    const messages = await Message.find({ conversation_id: req.params.conversation_id }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
