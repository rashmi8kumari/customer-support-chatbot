const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// POST /api/messages/send
router.post('/send', async (req, res) => {
  try {
    const { user_id, content, conversation_id } = req.body;

    if (!user_id || !content) {
      return res.status(400).json({ error: "user_id and content are required." });
    }

    let convoId = conversation_id;

    // 1️⃣ Create a new conversation if not provided
    if (!convoId) {
      convoId = uuidv4();
      await Conversation.create({
        conversation_id: convoId,
        user_id,
        started_at: new Date(),
        last_updated: new Date(),
        status: 'open',
        metadata: {
          source: 'api',
          language: 'en'
        }
      });
    }

    // 2️⃣ Save the user's message
    const userMessage = await Message.create({
      conversation_id: convoId,
      sender: {
        type: 'user',
        user_id,
        name: 'User'
      },
      content,
      timestamp: new Date(),
      message_type: 'text',
      metadata: {
        intent: 'unknown',
        confidence: 1.0,
        language: 'en'
      }
    });

    // 3️⃣ Generate a dummy AI response (you can replace with real AI logic later)
    const aiReplyText = `You said: "${content}"`; // ✨ Simulated response

    const botMessage = await Message.create({
      conversation_id: convoId,
      sender: {
        type: 'bot',
        name: 'AI Assistant'
      },
      content: aiReplyText,
      timestamp: new Date(),
      message_type: 'text'
    });

    // 4️⃣ Update conversation's last_updated timestamp
    await Conversation.updateOne(
      { conversation_id: convoId },
      { $set: { last_updated: new Date() } }
    );

    res.status(201).json({
      conversation_id: convoId,
      user_message: userMessage,
      ai_response: botMessage
    });

  } catch (err) {
    console.error('Message send error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

