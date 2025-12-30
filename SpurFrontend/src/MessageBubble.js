import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ type, text }) => {
  const isUser = type === 'user';
  
  return (
    <div className={`message-container ${isUser ? 'user' : 'ai'}`}>
      <div className={`message-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`}>
        {text}
      </div>
    </div>
  );
};

export default MessageBubble;
