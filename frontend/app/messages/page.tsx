'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

interface Conversation {
  jobId: string;
  jobTitle: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
}

interface Message {
  _id: string;
  fromUserId: { _id: string; name: string; role: string };
  toUserId: { _id: string; name: string; role: string };
  message: string;
  bidAmount?: number;
  createdAt: string;
  read: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function MessagesPage() {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/messages/conversations`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected job
  const fetchMessages = async (jobId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/messages/conversation/${jobId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
      // Scroll to bottom after messages load
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedJob) return;
    
    setSending(true);
    const messageToSend = newMessage;
    setNewMessage(''); // Clear input immediately for better UX
    
    try {
      const res = await fetch(`${API_URL}/api/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: selectedJob,
          message: messageToSend,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Refresh messages and conversations
        await fetchMessages(selectedJob);
        await fetchConversations();
      } else {
        console.error('Failed to send message:', data);
        alert(data.message || 'Failed to send message');
        // Restore the message if failed
        setNewMessage(messageToSend);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Error sending message. Please check your connection.');
      setNewMessage(messageToSend);
    }
    setSending(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get full timestamp for tooltip
  const getFullTimestamp = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, []);

  // Load messages when a conversation is selected
  useEffect(() => {
    if (selectedJob) {
      fetchMessages(selectedJob);
    }
  }, [selectedJob]);

  // Auto-refresh messages every 5 seconds when a conversation is open
  useEffect(() => {
    if (selectedJob) {
      const interval = setInterval(() => {
        fetchMessages(selectedJob);
        fetchConversations();
      }, 5000);
      setRefreshInterval(interval);
      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }
  }, [selectedJob]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Safely get selected conversation
  const selectedConversation = conversations && Array.isArray(conversations) 
    ? conversations.find(c => c.jobId === selectedJob) 
    : null;

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with homeowners and tradespeople</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
            {/* Conversations List - Left Sidebar */}
            <div className="border-r border-gray-200 flex flex-col">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Conversations</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {Array.isArray(conversations) ? conversations.length : 0} conversation{Array.isArray(conversations) && conversations.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-trade-primary"></div>
                    <p className="mt-2">Loading conversations...</p>
                  </div>
                ) : !Array.isArray(conversations) || conversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">chat</span>
                    <p className="text-gray-500">No conversations yet</p>
                    <p className="text-sm text-gray-400 mt-1">When you apply to jobs or receive messages, they'll appear here</p>
                    <Link 
                      href="/"
                      className="inline-block mt-4 text-trade-primary hover:underline text-sm"
                    >
                      Browse Jobs →
                    </Link>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.jobId}
                      onClick={() => setSelectedJob(conv.jobId)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                        selectedJob === conv.jobId ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{conv.jobTitle}</h3>
                          <p className="text-sm text-gray-500 truncate mt-1">{conv.lastMessage || 'No messages yet'}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(conv.lastMessageDate)}</p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="bg-trade-primary text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area - Right Side */}
            <div className="md:col-span-2 flex flex-col">
              {!selectedJob ? (
                <div className="flex-1 flex items-center justify-center p-8 text-center">
                  <div>
                    <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">chat_bubble</span>
                    <p className="text-gray-500">Select a conversation to start messaging</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <div>
                      <h2 className="font-semibold text-gray-900">{selectedConversation?.jobTitle || 'Conversation'}</h2>
                      <p className="text-xs text-gray-500 mt-1">
                        {user?.role === 'homeowner' ? 'Conversation with tradesperson' : 'Conversation with homeowner'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {!Array.isArray(messages) || messages.length === 0 ? (
                      <div className="text-center py-8">
                        <span className="material-symbols-outlined text-3xl text-gray-300 mb-2">chat</span>
                        <p className="text-gray-500">No messages yet</p>
                        <p className="text-sm text-gray-400 mt-1">Send a message to start the conversation</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isFromMe = msg.fromUserId?._id === user?.id;
                        return (
                          <div
                            key={msg._id}
                            className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] ${isFromMe ? 'order-2' : 'order-1'}`}>
                              <div
                                className={`rounded-lg p-3 ${
                                  isFromMe
                                    ? 'bg-trade-primary text-white'
                                    : 'bg-white text-gray-900 border border-gray-200'
                                }`}
                              >
                                <p className="text-sm break-words">{msg.message}</p>
                                {msg.bidAmount && (
                                  <p className={`text-xs mt-1 ${isFromMe ? 'text-blue-100' : 'text-trade-primary font-medium'}`}>
                                    💰 Bid: LKR {msg.bidAmount.toLocaleString()}
                                  </p>
                                )}
                              </div>
                              <p 
                                className={`text-xs text-gray-400 mt-1 ${isFromMe ? 'text-right' : 'text-left'} cursor-help`}
                                title={getFullTimestamp(msg.createdAt)}
                              >
                                {formatDate(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message... Press Enter to send"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-trade-primary focus:border-transparent"
                        disabled={sending}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={sending || !newMessage.trim()}
                        className="bg-trade-primary text-white px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-base">send</span>
                        {sending ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Messages are delivered instantly. Both parties can see all messages.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}