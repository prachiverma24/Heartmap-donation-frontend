import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './ChatBox.css';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      // Poll for new messages every 3 seconds
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('https://heartmap-donation-backend.onrender.com/api/chat');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitUsername = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsUsernameSet(true);
    }
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        await axios.post('https://heartmap-donation-backend.onrender.com/api/chat', {
          username,
          message: newMessage,
          language: 'en'
        });
        setNewMessage('');
        fetchMessages();
      } catch (error) {
        console.error('Error sending message:', error);
        // Add message locally if backend is not available
        const tempMessage = {
          _id: Date.now(),
          username,
          message: newMessage,
          timestamp: new Date()
        };
        setMessages([...messages, tempMessage]);
        setNewMessage('');
      }
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      <motion.button
        className="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          scale: isOpen ? 0 : 1,
          opacity: isOpen ? 0 : 1
        }}
      >
        💬
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-box"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="chat-header">
              <h3>💬 Community Chat</h3>
              <button 
                className="close-chat"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {!isUsernameSet ? (
              <div className="username-form">
                <h4>Enter your name to join the chat</h4>
                <form onSubmit={handleSubmitUsername}>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your name..."
                    maxLength="20"
                    required
                  />
                  <button type="submit">Join Chat</button>
                </form>
              </div>
            ) : (
              <>
                <div className="chat-messages">
                  {messages.length === 0 ? (
                    <div className="empty-chat">
                      <p>No messages yet. Be the first to say hello! 👋</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <motion.div
                        key={msg._id || index}
                        className={`message ${msg.username === username ? 'own-message' : ''}`}
                        initial={{ opacity: 0, x: msg.username === username ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="message-header">
                          <strong>{msg.username}</strong>
                          <span className="message-time">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <div className="message-content">
                          {msg.message}
                        </div>
                      </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-form" onSubmit={handleSubmitMessage}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    maxLength="500"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBox;
