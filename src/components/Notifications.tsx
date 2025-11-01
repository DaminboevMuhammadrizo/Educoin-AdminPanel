'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '@/utils/getToken';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';
import CreateNotificationModal from '@/modals/notification/CreateNoticication';

interface Translation {
    id: string;
    language: string;
    title: string;
    description: string;
}

interface Notification {
    id: string;
    image: string;
    isBroadcast: boolean;
    type: 'PLATFORM' | 'PERSONAL';
    role: 'CHILD' | 'PARENT';
    receivers: any[];
    translations: Translation[];
    createdAt: string;
    sentAt?: string;
    status: 'SENT' | 'PENDING' | 'FAILED';
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

export default function NotificationsPage() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');

    const getImageUrl = (imagePath: string): string => {
        if (!imagePath) return '';

        // Agar URL allaqachon to'liq bo'lsa
        if (imagePath.startsWith('http')) return imagePath;

        // Agar faqat fayl nomi bo'lsa (masalan: "ca9349a5-27e9-48b6-a6c1-72b160b2a836.jpeg")
        if (!imagePath.startsWith('/')) {
            return `${imgUrl}/${imagePath}`;
        }

        // Agar "/" bilan boshlansa
        return `${imgUrl}${imagePath}`;
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (selectedType) params.type = selectedType;
            if (selectedStatus) params.status = selectedStatus;
            if (selectedRole) params.role = selectedRole;

            const response = await axios.get<ApiResponse>(`${baseUrl}/notifications/admin`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'application/json'
                },
                params
            });

            if (response.data.success && response.data.data.data) {
                setNotifications(response.data.data.data);
            } else {
                throw new Error('Ma\'lumotlar formati noto\'g\'ri');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [selectedType, selectedStatus, selectedRole]);

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await axios.delete(`${baseUrl}/notifications/${deleteId}`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });
            setNotifications(prev => prev.filter(notification => notification.id !== deleteId));
            setDeleteId(null);
            toast.success("Bildirishnoma o'chirildi");
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        }
    };

    const getUZTitle = (translations: Translation[]) => {
        return translations.find(t => t.language === 'UZ')?.title || 'Noma\'lum';
    };

    const getUZDescription = (translations: Translation[]) => {
        const desc = translations.find(t => t.language === 'UZ')?.description || "Tavsif yo'q";
        return desc.length > 100 ? desc.substring(0, 100).trim() + '...' : desc;
    };

    const getTypeLabel = (type: string) => {
        const types: { [key: string]: string } = {
            'PLATFORM': 'Platforma',
            'PERSONAL': 'Shaxsiy'
        };
        return types[type] || type;
    };

    const getRoleLabel = (role: string) => {
        const roles: { [key: string]: string } = {
            'CHILD': 'Bola',
            'PARENT': 'Ota-Ona'
        };
        return roles[role] || role;
    };

    const getStatusLabel = (status: string) => {
        const statuses: { [key: string]: { label: string, color: string } } = {
            'SENT': { label: 'Yuborilgan', color: 'bg-green-100 text-green-800' },
            'PENDING': { label: 'Kutilmoqda', color: 'bg-yellow-100 text-yellow-800' },
            'FAILED': { label: 'Xatolik', color: 'bg-red-100 text-red-800' }
        };
        return statuses[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replaceAll('/', '.');
    };

    const handleAddSuccess = () => {
        fetchNotifications();
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Bildirishnomalar</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Jami {notifications.length} ta bildirishnoma
                    </p>
                </div>
                <button
                    onClick={() => setOpenCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg"
                    style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
                >
                    <AddIcon sx={{ fontSize: 20 }} />
                    <span>Yangi Bildirishnoma</span>
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Turi bo'yicha
                    </label>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="">Barcha turlar</option>
                        <option value="PLATFORM">Platforma</option>
                        <option value="PERSONAL">Shaxsiy</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Holati bo'yicha
                    </label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="">Barcha holatlar</option>
                        <option value="SENT">Yuborilgan</option>
                        <option value="PENDING">Kutilmoqda</option>
                        <option value="FAILED">Xatolik</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rol bo'yicha
                    </label>
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="">Barcha rollar</option>
                        <option value="CHILD">Bola</option>
                        <option value="PARENT">Ota-Ona</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={fetchNotifications}
                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Yangilash
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <CircularProgress sx={{ color: '#7C6BB3' }} />
                </div>
            ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-4">📢</div>
                    <p className="text-lg font-medium mb-2">Bildirishnomalar topilmadi</p>
                    <p className="text-sm">Yangi bildirishnoma yuborish uchun "Yangi Bildirishnoma" tugmasini bosing</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {notifications.map((notification) => {
                        const statusInfo = getStatusLabel(notification.status);
                        return (
                            <div key={notification.id} className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                                {/* Header with image and actions */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                            {notification.image ? (
                                                <img
                                                    src={getImageUrl(notification.image)}
                                                    alt={getUZTitle(notification.translations)}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`w-full h-full flex items-center justify-center ${notification.image ? 'hidden' : 'flex'}`}>
                                                <span className="text-xl">📢</span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDate(notification.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                                            <VisibilityIcon sx={{ fontSize: 18 }} />
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                                            <EditIcon sx={{ fontSize: 18 }} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(notification.id)}
                                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <DeleteIcon sx={{ fontSize: 18 }} />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                                        {getUZTitle(notification.translations)}
                                    </h3>

                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {getUZDescription(notification.translations)}
                                    </p>

                                    {/* Meta information */}
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">Turi:</span>
                                            <span className="font-medium">{getTypeLabel(notification.type)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">Rol:</span>
                                            <span className="font-medium">{getRoleLabel(notification.role)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">Yuborish turi:</span>
                                            <span className="font-medium">
                                                {notification.isBroadcast ? 'Hammaga' : `${notification.receivers?.length || 0} ta foydalanuvchi`}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">Yuborilgan:</span>
                                            <span className="font-medium">
                                                {notification.sentAt ? formatDate(notification.sentAt) : 'Yuborilmagan'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Languages */}
                                    <div className="pt-2 border-t border-gray-200">
                                        <div className="flex flex-wrap gap-1">
                                            {notification.translations.map((trans) => (
                                                <span
                                                    key={trans.id}
                                                    className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                                                >
                                                    {trans.language}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Modal */}
            <CreateNotificationModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onSuccess={handleAddSuccess}
            />

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold mb-4">Bildirishnomani o'chirish</h3>
                        <p className="text-gray-600 mb-6">Rostan ham bu bildirishnomani o'chirmoqchimisiz?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                O'chirish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
