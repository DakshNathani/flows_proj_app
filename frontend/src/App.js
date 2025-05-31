// frontend/src/App.js - Updated version with backend connection
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // State to store all messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant powered by GROQ. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  
  // State for the input field
  const [inputMessage, setInputMessage] = useState('');
  
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // Function to send message to backend
  const sendMessageToBackend = async (message) => {
    try {
      const response = await fetch('http://localhost:5000/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  };

  // Function to handle sending messages
  const handleSendMessage = async () => {
    // Don't send empty messages
    if (inputMessage.trim() === '') return;
    
    // Create new user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    
    // Add user message to the list
    setMessages(prev => [...prev, userMessage]);
    
    // Store the message before clearing input
    const messageToSend = inputMessage;
    
    // Clear input field and set loading state
    setInputMessage('');
    setIsLoading(true);
    
    // Send message to backend and get response
    const botResponseText = await sendMessageToBackend(messageToSend);
    
    // Create bot response message
    const botResponse = {
      id: Date.now() + 1,
      text: botResponseText,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    };
    
    // Add bot response to messages
    setMessages(prev => [...prev, botResponse]);
    setIsLoading(false);
  };

  // Function to handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row h-100 g-0">
        <div className="col-12">
          {/* Header */}
          <div className="bg-primary text-white p-3 text-center">
            <h2 className="mb-1">🤖 AI Chatbot</h2>
            <small className="text-light">
              {isLoading ? 'AI is thinking...' : 'Powered by GROQ AI'}
            </small>
          </div>
          
          {/* Messages Container */}
          <div 
            className="p-3 bg-light overflow-auto"
            style={{ height: 'calc(100vh - 170px)' }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`d-flex mb-3 ${
                  message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'
                }`}
              >
                <div
                  className={`card shadow-sm ${
                    message.sender === 'user' 
                      ? 'bg-primary text-white ms-5' 
                      : 'bg-white text-dark me-5'
                  }`}
                  style={{ maxWidth: '70%' }}
                >
                  <div className="card-body p-3">
                    <p className="card-text mb-1">{message.text}</p>
                    <small 
                      className={
                        message.sender === 'user' 
                          ? 'text-light' 
                          : 'text-muted'
                      }
                    >
                      {message.timestamp}
                    </small>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="d-flex justify-content-start mb-3">
                <div className="card shadow-sm bg-white text-dark me-5" style={{ maxWidth: '70%' }}>
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center">
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <span>AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="bg-white border-top p-3">
            <div className="row g-2">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your message here..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
              </div>
              <div className="col-auto">
                <button
                  className="btn btn-primary"
                  onClick={handleSendMessage}
                  disabled={inputMessage.trim() === '' || isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                      Sending...
                    </>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;