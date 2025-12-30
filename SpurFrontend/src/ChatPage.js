import React, { useEffect, useState, useRef } from 'react';
import './ChatPage.css';
import MessageBubble from './MessageBubble';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState('');
    const messagesEndRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


    useEffect(() => {
        if (sessionStorage.getItem('sessionId')) {
            const existingSessionId = sessionStorage.getItem('sessionId');
            setSessionId(existingSessionId);
            fetchMessages(existingSessionId);
            return;
        } else {
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);
        sessionStorage.setItem('sessionId', newSessionId);
        }           
  }, []);


const fetchMessages = async (sessionId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/messages?sessionId=${sessionId}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    setMessages(data);
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    setMessages([]); // fallback so UI doesn’t break
  }
};


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { type: 'user', text: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setIsLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/api/sendQuery`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: sessionId,
            query: input,
          }),
        });

        const data = await response.json();
        if (data.sessionId && data.sessionId !== sessionId) {
                setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'ai', text: 'Session Issues please reload the page' },
          ]);
        } else {
            const aiMessage = { type: 'ai', text: data.response };
            setMessages((prevMessages) => [...prevMessages, aiMessage]);
        }
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'ai', text: 'Sorry, there was an error processing your request. Why not try again after sometime :)' },
        ]);
      }
      finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="chat-page">
      <div className="chat-header">LIVE CHAT</div>
      <div className="messages-area">
        {messages.map((msg, index) => (
          <MessageBubble key={index} type={msg.type} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
        {isLoading && <div className="typing-indicator">Agent is typing...</div>}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
