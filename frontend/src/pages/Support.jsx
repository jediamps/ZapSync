import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Send, Menu, Bot, User, 
  Loader2, AlertCircle, CheckCircle 
} from 'lucide-react';
import { useOutletContext } from 'react-router';

// Mock Gemini API client (replace with actual implementation)
const mockGeminiResponse = async (message) => {
  // In a real implementation, you would call the actual Gemini API here
  const responses = {
    'hello': 'Hello! How can I assist you with Zapsync today?',
    'help': 'I can help with account issues, file sharing problems, or general questions about Zapsync.',
    'upload': 'To upload files, click the "Upload" button in the top right corner of your dashboard.',
    'download': 'To download files, click the download icon next to any file in your library.',
    'default': 'I\'m the Zapsync AI assistant. Ask me anything about file sharing, storage, or account settings.'
  };

  const lowerMsg = message.toLowerCase();
  const response = Object.keys(responses).find(key => lowerMsg.includes(key)) 
    ? responses[Object.keys(responses).find(key => lowerMsg.includes(key))]
    : responses['default'];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return response;
};

function Support() {
  const { toggleSidebar } = useOutletContext();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I\'m your Zapsync AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // Replace this with your actual Gemini API call
      const botResponse = await mockGeminiResponse(input);
      
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError('Failed to get response from AI assistant');
      console.error('AI Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Header with sidebar toggle */}
      <div className="flex flex-col md:flex-row items-start md:items-center mb-6 gap-7">
        <button className="text-gray-600" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            Support Center
          </h1>
          <p className="text-sm text-gray-500">Get help from our AI assistant or browse resources</p>
        </div>
      </div>

      {/* Chat container */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Chat header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-blue-100 p-2 rounded-full">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-base font-medium text-gray-900">Zapsync AI Assistant</h3>
              <p className="text-sm text-gray-500">
                {loading ? 'Typing...' : 'Online'}
                {loading && <Loader2 className="inline w-3 h-3 ml-1 animate-spin" />}
              </p>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  <div className="flex items-start">
                    {message.sender === 'bot' && (
                      <Bot className="flex-shrink-0 w-4 h-4 mt-1 mr-2 text-gray-500" />
                    )}
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-center">
                <div className="bg-red-50 text-red-800 rounded-lg px-4 py-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`bg-[var(--color-primary)] text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${(loading || !input.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            The AI assistant may produce inaccurate information. For critical issues, contact our support team.
          </p>
        </div>
      </div>

      {/* Help resources (optional) */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
          <h3 className="font-medium text-gray-900 mb-2 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            Getting Started Guide
          </h3>
          <p className="text-sm text-gray-600">Learn how to upload, share and organize files</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
          <h3 className="font-medium text-gray-900 mb-2 flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
            Troubleshooting
          </h3>
          <p className="text-sm text-gray-600">Solutions for common problems and errors</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
          <h3 className="font-medium text-gray-900 mb-2 flex items-center">
            <MessageSquare className="w-5 h-5 text-blue-500 mr-2" />
            Contact Support
          </h3>
          <p className="text-sm text-gray-600">Email our team for personalized assistance</p>
        </div>
      </div>
    </div>
  );
}

export default Support;