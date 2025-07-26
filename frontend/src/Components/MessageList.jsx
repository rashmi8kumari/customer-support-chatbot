import React from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const MessageList = () => {
  const { messages, isTyping } = useChat();

  return (
    <div className="message-list flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} />
      ))}
      {isTyping && <TypingIndicator />}
    </div>
  );
};

export default MessageList;
