const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
require('dotenv').config();

const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// 🧠 Groq AI Request Function
async function getAIResponseFromGroq(userMessage) {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: process.env.GROQ_MODEL || 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error('Groq API error:', err.response?.data || err.message);
    return "Sorry, I couldn't generate a response right now.";
  }
}

// 📨 POST /api/messages/send
router.post('/send', async (req, res) => {
  try {
    const { user_id, content, conversation_id } = req.body;

    if (!user_id || !content) {
      return res.status(400).json({ error: "user_id and content are required." });
    }

    let convoId = conversation_id;

    // 🔹 Create conversation if missing
    if (!convoId) {
      convoId = uuidv4();
      await Conversation.create({
        conversation_id: convoId,
        user_id,
        started_at: new Date(),
        last_updated: new Date(),
        status: 'open',
        metadata: { source: 'api', language: 'en' }
      });
    }

    // 💬 Save user's message
    const userMessage = await Message.create({
      conversation_id: convoId,
      sender: { type: 'user', user_id, name: 'User' },
      content,
      timestamp: new Date(),
      message_type: 'text'
    });

    // 🤖 Get AI response from Groq
    const aiText = await getAIResponseFromGroq(content);

    // 💬 Save bot message
    const botMessage = await Message.create({
      conversation_id: convoId,
      sender: { type: 'bot', name: 'AI Assistant' },
      content: aiText,
      timestamp: new Date(),
      message_type: 'text'
    });

    // ⏱ Update conversation
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
    console.error('Send error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;


