import { useState } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputMessage
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('https://adventurous-spirit-production-4334.up.railway.app/chat', {
        message: inputMessage,
        groqApiKey: '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'
      });

      const botMessage = {
        type: 'bot',
        content: response.data.response || 'Sorry, I could not process your request.'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'bot',
        content: 'Sorry, there was an error processing your request.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat Bot</h1>
      </div>
      
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-wrapper ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              <div className="avatar">
                {message.type === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-bubble">
                {message.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper bot-message">
            <div className="message-content">
              <div className="avatar">🤖</div>
              <div className="message-bubble loading">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
        />
        <button 
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
        >
          Send ➤
        </button>
      </div>

      <style>{`
        .chat-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          height: 600px;
          border: 1px solid #ccc;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          background-color: #f5f5f5;
        }

        .chat-header {
          padding: 16px;
          background-color: #007bff;
          color: white;
          border-radius: 8px 8px 0 0;
        }

        .chat-header h1 {
          margin: 0;
          font-size: 20px;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message-wrapper {
          display: flex;
          justify-content: flex-start;
        }

        .message-wrapper.user-message {
          justify-content: flex-end;
        }

        .message-content {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          max-width: 80%;
        }

        .user-message .message-content {
          flex-direction: row-reverse;
        }

        .avatar {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e0e0e0;
          border-radius: 50%;
          font-size: 16px;
        }

        .message-bubble {
          padding: 12px;
          border-radius: 12px;
          background-color: white;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .user-message .message-bubble {
          background-color: #007bff;
          color: white;
        }

        .chat-input {
          padding: 16px;
          border-top: 1px solid #ccc;
          display: flex;
          gap: 8px;
          background-color: white;
          border-radius: 0 0 8px 8px;
        }

        .chat-input input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }

        .chat-input input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .chat-input button {
          padding: 8px 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .chat-input button:hover:not(:disabled) {
          background-color: #0056b3;
        }

        .chat-input button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .loading {
          display: flex;
          gap: 4px;
          padding: 8px 12px;
        }

        .dot {
          width: 8px;
          height: 8px;
          background-color: #666;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          } 
          40% { 
            transform: scale(1.0);
          }
        }

        /* Custom scrollbar */
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;