import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [userId] = useState('U123'); // Hardcoded for demo
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      sender: 'user',
      content,
    };

    // Update UI immediately
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const res = await axios.post('/api/messages/send', {
        user_id: userId,
        content,
        conversation_id: conversationId,
      });

      setConversationId(res.data.conversation_id);

      // Add AI response
      setMessages((prev) => [
        ...prev,
        userMessage,
        {
          sender: 'bot',
          content: res.data.ai_response.content,
        },
      ]);
    } catch (err) {
      console.error('Send failed:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          content: 'Something went wrong!',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        userId,
        conversationId,
        messages,
        sendMessage,
        isTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
