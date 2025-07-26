const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] p-3 rounded-lg text-white ${
          isUser ? 'bg-blue-600' : 'bg-gray-500'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default MessageBubble;
