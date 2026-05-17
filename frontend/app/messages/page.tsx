'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Link from 'next/link';

interface Message {
  id: string;
  from: string;
  fromEmail: string;
  jobTitle: string;
  message: string;
  date: string;
  read: boolean;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'John Smith',
      fromEmail: 'john@plumbing.com',
      jobTitle: 'fridge repair',
      message: 'Hi, I can help with your fridge repair. I have 10 years of experience. When would be a good time to discuss?',
      date: '2024-05-18',
      read: false,
    },
    {
      id: '2',
      from: 'Mike Johnson',
      fromEmail: 'mike@electrical.com',
      jobTitle: 'pipe leaking',
      message: 'I specialize in pipe repairs. Can come tomorrow morning. Please let me know if that works.',
      date: '2024-05-17',
      read: true,
    },
  ]);

  const markAsRead = (id: string) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with tradespeople about your service requests</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-gray-400 mb-3">chat</span>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No messages yet</h2>
              <p className="text-gray-500">When tradespeople contact you about your jobs, they'll appear here.</p>
              <Link 
                href="/jobs/new"
                className="inline-block mt-4 bg-trade-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
              >
                Post a Job to Get Started
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-5 hover:bg-gray-50 transition-colors cursor-pointer ${!message.read ? 'bg-blue-50' : ''}`}
                  onClick={() => markAsRead(message.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{message.from}</span>
                        {!message.read && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Regarding: <span className="font-medium text-trade-primary">{message.jobTitle}</span>
                      </p>
                      <p className="text-gray-700 text-sm">{message.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(message.date).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'short', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <button className="text-trade-primary hover:text-trade-primary-light text-sm font-medium ml-4">
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}