'use client';

import { useState } from 'react';
import Header from '../components/Header';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'message' | 'status' | 'job';
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Message Received',
      message: 'John Smith sent you a message about "fridge repair"',
      date: '2024-05-18T10:30:00',
      read: false,
      type: 'message',
    },
    {
      id: '2',
      title: 'Job Status Updated',
      message: 'Your job "pipe leaking" has been marked as In Progress',
      date: '2024-05-17T15:20:00',
      read: false,
      type: 'status',
    },
    {
      id: '3',
      title: 'New Job Posted',
      message: 'Your job "fridge repair" has been posted successfully',
      date: '2024-05-16T09:00:00',
      read: true,
      type: 'job',
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'message': return 'chat';
      case 'status': return 'sync';
      default: return 'work';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">Stay updated with your job requests and messages</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-trade-primary hover:text-trade-primary-light font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-gray-400 mb-3">notifications_off</span>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No notifications yet</h2>
              <p className="text-gray-500">When updates happen, they'll appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-5 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        notification.type === 'message' ? 'bg-blue-100' :
                        notification.type === 'status' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}>
                        <span className="material-symbols-outlined text-lg text-trade-primary">
                          {getIcon(notification.type)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.date).toLocaleString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                    </div>
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