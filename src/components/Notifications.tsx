'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import { getAccessToken } from '@/utils/getToken';

interface Translation {
  id: string;
  language: 'UZ' | 'RU' | 'EN';
  title: string;
  description: string;
}

interface Notification {
  id: string;
  image: string;
  type: 'PERSONAL' | 'PLATFORM' | 'SYSTEM';
  translations: Translation[];
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/admin`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      setNotifications(response.data.data.data);
    } catch (err: any) {
      if (err.response?.status === 404) setError('Bildirishnomalar topilmadi (404)');
      else if (err.response?.status === 401) setError('Kirish rad etildi. Iltimos, qaytadan kiring');
      else if (err.response?.status === 403) setError('Sizda bu sahifaga kirish uchun ruxsat yo‘q');
      else if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error'))
        setError('Internet aloqasi yo‘q. Iltimos, internetingizni tekshiring');
      else setError('Bildirishnomalarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getImageUrl = (path: string) => {
    if (!path) return '/default-notification-image.jpg';
    if (path.startsWith('http')) return path;
    return `${IMAGE_BASE_URL}/${path}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    const hrs = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);

    if (mins < 1) return 'Hozirgina';
    if (mins < 60) return `${mins} daqiqa oldin`;
    if (hrs < 24) return `${hrs} soat oldin`;
    if (days < 7) return `${days} kun oldin`;
    return date.toLocaleDateString('uz-UZ');
  };

  const getTypeBadge = (type: 'PERSONAL' | 'PLATFORM' | 'SYSTEM') => {
    const types = {
      PLATFORM: { text: 'Platforma', color: 'bg-blue-100 text-blue-700' },
      PERSONAL: { text: 'Shaxsiy', color: 'bg-green-100 text-green-700' },
      SYSTEM: { text: 'Tizim', color: 'bg-purple-100 text-purple-700' },
    };
    return types[type];
  };

  const getTranslation = (translations: Translation[]) =>
    translations.find(t => t.language === 'UZ') || translations[0];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = '/default-notification-image.jpg';
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <NotificationsIcon sx={{ fontSize: 36, color: '#4F46E5' }} />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Bildirishnomalar</h1>
            <p className="text-gray-600 text-sm">{notifications.length} ta xabar</p>
          </div>
        </div>
        <button
          onClick={fetchNotifications}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          <RefreshIcon
            sx={{
              color: loading ? '#9CA3AF' : '#4F46E5',
              animation: loading ? 'spin 1s linear infinite' : 'none',
            }}
          />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={fetchNotifications}
            className="text-red-700 hover:text-red-800 text-sm font-medium"
            disabled={loading}
          >
            Qayta urinish
          </button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-3 text-gray-600">Bildirishnomalar yuklanmoqda...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <NotificationsIcon sx={{ fontSize: 48, color: '#9CA3AF', marginBottom: 2 }} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Bildirishnomalar mavjud emas</h3>
          <p className="text-gray-500">Hozircha yangi xabarlar yo'q</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(n => {
            const translation = getTranslation(n.translations);
            const badge = getTypeBadge(n.type);
            return (
              <div
                key={n.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4 p-4">
                  <img
                    src={getImageUrl(n.image)}
                    alt={translation.title}
                    className="w-24 h-24 rounded-lg object-cover"
                    onError={handleImageError}
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800 text-lg">{translation.title}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${badge.color}`}
                      >
                        {badge.text}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{translation.description}</p>
                    <span className="text-xs text-gray-500">{formatDate(n.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
