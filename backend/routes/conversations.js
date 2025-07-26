const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

// POST /api/conversations
router.post('/', async (req, res) => {
  try {
    const convo = await Conversation.create(req.body);
    res.status(201).json(convo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/conversations/:user_id
router.get('/:user_id', async (req, res) => {
  const convos = await Conversation.find({ user_id: req.params.user_id });
  res.json(convos);
});

module.exports = router;
