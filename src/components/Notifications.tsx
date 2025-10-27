'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getAccessToken } from '@/utils/getToken';
import axios from 'axios';

// Types
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

interface ApiResponse {
    statusCode: number;
    success: boolean;
    data: {
        data: Notification[];
        meta: {
            pagination: {
                pageNumber: number;
                pageSize: number;
                count: number;
                pageCount: number;
            };
        };
    };
}

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // API base URL - change this to your actual API URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

    // useCallback bilan fetchNotifications funksiyasini memoize qilish
    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching notifications from:', `${API_BASE_URL}/notifications/admin`);

            const response = await axios.get<ApiResponse>(`${API_BASE_URL}/notifications/admin`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'application/json'
                },
            });

            const result = response.data;

            if (result.success && result.statusCode === 200) {
                console.log('Notifications fetched successfully:', result.data.data.length);
                setNotifications(result.data.data);
            } else {
                throw new Error('API response was not successful');
            }
        } catch (err: any) {
            console.error('Error fetching notifications:', err);

            if (err.response?.status === 404) {
                setError('Bildirishnomalar API topilmadi (404)');
            } else if (err.response?.status === 401) {
                setError('Kirish rad etildi. Iltimos, qaytadan kiring');
            } else if (err.response?.status === 403) {
                setError('Sizda bu sahifaga kirish uchun ruxsat yo\'q');
            } else if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
                setError('Internet aloqasi yo\'q. Iltimos, internetingizni tekshiring');
            } else {
                setError('Bildirishnomalarni yuklashda xatolik yuz berdi');
            }
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    // useEffect ni to'g'ri ishlatish
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]); // fetchNotifications dependency ga qo'shildi

    // Rasm URL ni tuzatish funksiyasi
    const getImageUrl = (imagePath: string) => {
        if (!imagePath || imagePath === 'string') {
            return '/default-notification-image.jpg';
        }

        // Agar imagePath to'liq URL bo'lsa, o'shasini qaytar
        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        // Agar faqat filename bo'lsa, base URL ga qo'sh
        return `${IMAGE_BASE_URL}/${imagePath}`;
    };

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
        const types = {
            PLATFORM: { text: 'Platforma', color: 'bg-blue-100 text-blue-700' },
            PERSONAL: { text: 'Shaxsiy', color: 'bg-green-100 text-green-700' },
        };

        return types[type as keyof typeof types] || { text: type, color: 'bg-gray-100 text-gray-700' };
    };

    const getTranslation = (translations: Translation[], preferredLanguage: 'UZ' | 'RU' | 'EN' = 'UZ') => {
        const translation = translations.find(t => t.language === preferredLanguage);

        return translation || translations[0];
    };

    const handleRefresh = () => {
        fetchNotifications();
    };

    // Rasm yuklash xatosi uchun
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.src = '/default-notification-image.jpg';
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
                    onClick={handleRefresh}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={loading}
                >
                    <RefreshIcon
                        sx={{
                            color: loading ? '#9CA3AF' : '#4F46E5',
                            animation: loading ? 'spin 1s linear infinite' : 'none'
                        }}
                    />
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <p className="text-red-700 text-sm">{error}</p>
                        <button
                            onClick={fetchNotifications}
                            className="text-red-700 hover:text-red-800 text-sm font-medium"
                            disabled={loading}
                        >
                            Qayta urinish
                        </button>
                    </div>
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
                    <p className="mt-3 text-gray-600">Bildirishnomalar yuklanmoqda...</p>
                </div>
            ) : (
                /* Notifications List */
                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <NotificationsIcon sx={{ fontSize: 48, color: '#9CA3AF', marginBottom: 2 }} />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Bildirishnomalar mavjud emas</h3>
                            <p className="text-gray-500">Hozircha yangi xabarlar yo'q</p>
                        </div>
                    ) : (
                        notifications.map((notification) => {
                            const badge = getTypeBadge(notification.type);
                            const translation = getTranslation(notification.translations, 'UZ');
                            const imageUrl = getImageUrl(notification.image);

                            return (
                                <div
                                    key={notification.id}
                                    className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                                >
                                    <div className="flex gap-4 p-4">
                                        {/* Image */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={imageUrl}
                                                alt={translation.title}
                                                className="w-24 h-24 rounded-lg object-cover"
                                                onError={handleImageError}
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="font-semibold text-gray-800 text-lg">
                                                    {translation.title}
                                                </h3>
                                                <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${badge.color}`}>
                                                    {badge.text}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-3">
                                                {translation.description}
                                            </p>

                                            <span className="text-xs text-gray-500">
                                                {formatDate(notification.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
