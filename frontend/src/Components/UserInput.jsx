import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';

const UserInput = () => {
  const [text, setText] = useState('');
  const { sendMessage } = useChat();

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(text);
      setText('');
    }
  };

  return (
    <div className="user-input flex p-2 border-t">
      <input
        type="text"
        className="flex-1 px-3 py-2 border rounded"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button
        onClick={handleSend}
        className="ml-2 px-4 bg-blue-600 text-white rounded"
      >
        Send
      </button>
    </div>
  );
};

export default UserInput;
