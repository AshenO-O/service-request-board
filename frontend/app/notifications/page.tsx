'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAuth } from '../../context/AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function NotificationsPage() {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // For now, use sample data since backend notifications endpoint not yet created
      // In production, fetch from API: GET /api/notifications
      const sampleNotifications = [
        {
          id: '1',
          title: 'New Application Received',
          message: 'A tradesperson has applied to your job "fridge repair"',
          date: new Date().toISOString(),
          read: false,
          type: 'application',
        },
        {
          id: '2',
          title: 'Application Accepted!',
          message: 'Your application for "pipe leaking" has been accepted',
          date: new Date().toISOString(),
          read: false,
          type: 'application_accepted',
        },
      ];
      setNotifications(sampleNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'application': return 'handshake';
      case 'application_accepted': return 'check_circle';
      default: return 'notifications';
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
            <p className="text-gray-600">Stay updated with your job requests and applications</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
              className="text-sm text-trade-primary hover:text-trade-primary-light font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-trade-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
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
                        notification.type === 'application' ? 'bg-blue-100' :
                        notification.type === 'application_accepted' ? 'bg-green-100' : 'bg-gray-100'
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