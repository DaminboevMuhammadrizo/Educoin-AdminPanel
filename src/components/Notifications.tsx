'use client';

import React, { useState, useEffect } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RefreshIcon from '@mui/icons-material/Refresh';

// Types
interface Translation {
  language: 'UZ' | 'RU' | 'EN';
  title: string;
  description: string;
}

interface Notification {
  id: string;
  image: string;
  type: 'PLATFORM' | 'USER' | 'SYSTEM';
  translations: Translation[];
  createdAt: string;
}

// Mock data
const mockNotifications: Notification[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
    type: 'PLATFORM',
    translations: [
      {
        language: 'UZ',
        title: 'Yangi kurslar mavjud!',
        description: 'JavaScript va React bo\'yicha yangi kurslar platformaga qo\'shildi. Hoziroq o\'rganishni boshlang!'
      }
    ],
    createdAt: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400',
    type: 'PLATFORM',
    translations: [
      {
        language: 'UZ',
        title: 'Python kursi qo\'shildi',
        description: 'Dasturlash dunyosiga kirish uchun Python kursini boshlang. Bepul darslar mavjud.'
      }
    ],
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
  }
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 500);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hozirgina';
    if (diffMins < 60) return `${diffMins} daqiqa oldin`;
    if (diffHours < 24) return `${diffHours} soat oldin`;
    if (diffDays < 7) return `${diffDays} kun oldin`;
    return date.toLocaleDateString('uz-UZ');
  };

  const getTypeBadge = (type: string) => {
    return { text: 'Platforma', color: 'bg-blue-100 text-blue-700' };
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <NotificationsIcon sx={{ fontSize: 36, color: '#4F46E5' }} />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Bildirishnomalar</h1>
            <p className="text-gray-600 text-sm">{notifications.length} ta xabar</p>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <RefreshIcon sx={{ color: '#4F46E5' }} />
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : (
        /* Notifications List */
        <div className="space-y-4">
          {notifications.map((notification) => {
            const badge = getTypeBadge(notification.type);
            return (
              <div
                key={notification.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4 p-4">
                  {/* Image */}
                  <img
                    src={notification.image}
                    alt={notification.translations[0].title}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {notification.translations[0].title}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">
                      {notification.translations[0].description}
                    </p>

                    <span className="text-xs text-gray-500">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
