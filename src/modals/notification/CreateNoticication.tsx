'use client';

import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { getAccessToken } from '@/utils/getToken';
import toast from 'react-hot-toast';

interface Translation {
    language: string;
    title: string;
    description: string;
}

interface User {
    id: string;
    firstname: string;
    lastname: string;
    phone: string;
    role: 'CHILD' | 'PARENT';
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function CreateNotificationModal({ open, onClose, onSuccess }: Props) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;

    const [translations, setTranslations] = useState<Translation[]>([
        { language: 'UZ', title: '', description: '' },
        { language: 'RU', title: '', description: '' },
        { language: 'EN', title: '', description: '' }
    ]);
    const [image, setImage] = useState('');
    const [isBroadcast, setIsBroadcast] = useState(true);
    const [type, setType] = useState<'PLATFORM' | 'PERSONAL'>('PLATFORM');
    const [role, setRole] = useState<'CHILD' | 'PARENT'>('CHILD');
    const [receivers, setReceivers] = useState<string[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    // Rasm URL ni to'g'ri formatga o'tkazish
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

    useEffect(() => {
        if (open && !isBroadcast) {
            fetchUsers();
        }
    }, [open, isBroadcast]);

    useEffect(() => {
        if (users.length > 0) {
            setFilteredUsers(users.filter(user => user.role === role));
        }
    }, [users, role]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${baseUrl}/users`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });
            if (response.data.success) {
                setUsers(response.data.data.data || []);
            }
        } catch (err) {
            console.error('Users fetch error:', err);
            toast.error('Foydalanuvchilarni yuklashda xatolik');
        }
    };

    useEffect(() => {
        if (!open) {
            setTranslations([
                { language: 'UZ', title: '', description: '' },
                { language: 'RU', title: '', description: '' },
                { language: 'EN', title: '', description: '' }
            ]);
            setImage('');
            setIsBroadcast(true);
            setType('PLATFORM');
            setRole('CHILD');
            setReceivers([]);
            setPreviewUrl('');
        }
    }, [open]);

    // Rasm yuklash funksiyasi
    const handleFileUpload = async (file: File) => {
        try {
            setUploading(true);
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);

            const response = await axios.post(`${baseUrl}/notifications/file`, uploadFormData, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            if (response.data.success) {
                const imageUrl = response.data.data.url;
                const fullImageUrl = getImageUrl(imageUrl);

                console.log('Original URL:', imageUrl);
                console.log('Formatted URL:', fullImageUrl);

                setImage(imageUrl);
                setPreviewUrl(fullImageUrl);
                toast.success('Rasm muvaffaqiyatli yuklandi');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Rasm yuklashda xatolik');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    // Butun div bosilganda file inputni ishga tushirish
    const handleDivClick = () => {
        if (!uploading) {
            document.getElementById('file-upload-input')?.click();
        }
    };

    const handleTranslationChange = (language: string, field: 'title' | 'description', value: string) => {
        setTranslations(prev =>
            prev.map(t =>
                t.language === language ? { ...t, [field]: value } : t
            )
        );
    };

    const handleReceiverChange = (userId: string) => {
        setReceivers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const emptyTranslation = translations.find(t => !t.title.trim() || !t.description.trim());
        if (emptyTranslation) {
            toast.error('Barcha tillar uchun sarlavha va tavsifni kiriting!');
            return;
        }

        if (!isBroadcast && receivers.length === 0) {
            toast.error('Kamida bitta foydalanuvchi tanlang!');
            return;
        }

        setLoading(true);
        try {
            const notificationData = {
                image: image.trim(),
                isBroadcast: isBroadcast,
                type: type,
                role: role,
                reciviers: isBroadcast ? [] : receivers,
                translations: translations.map(t => ({
                    language: t.language,
                    title: t.title.trim(),
                    description: t.description.trim(),
                })),
            };

            await axios.post(`${baseUrl}/notifications`, notificationData, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            toast.success('Bildirishnoma yaratildi!');
            onSuccess?.();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
            <div
                className="w-full sm:w-[450px] h-full bg-white overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center px-6 py-5 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold text-gray-900">Yangi Bildirishnoma</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    >
                        <CloseIcon fontSize="small" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                    {/* Broadcast toggle */}
                    <div>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isBroadcast}
                                onChange={(e) => setIsBroadcast(e.target.checked)}
                                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Hammaga yuborish (Broadcast)
                            </span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                            {isBroadcast
                                ? 'Bildirishnoma barcha foydalanuvchilarga yuboriladi'
                                : 'Faqat tanlangan foydalanuvchilarga yuboriladi'
                            }
                        </p>
                    </div>

                    {/* Type selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Turi *
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as 'PLATFORM' | 'PERSONAL')}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                            required
                        >
                            <option value="PLATFORM">Platforma</option>
                            <option value="PERSONAL">Shaxsiy</option>
                        </select>
                    </div>

                    {/* Role selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rol *
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'CHILD' | 'PARENT')}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                            required
                        >
                            <option value="CHILD">Bola</option>
                            <option value="PARENT">Ota-ona</option>
                        </select>
                    </div>

                    {/* Receivers selection (only when not broadcast) */}
                    {!isBroadcast && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Foydalanuvchilar ({role}) *
                            </label>
                            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
                                {filteredUsers.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-2">
                                        {role === 'CHILD' ? 'Bolalar' : 'Ota-onalar'} topilmadi
                                    </p>
                                ) : (
                                    filteredUsers.map(user => (
                                        <label key={user.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                                            <input
                                                type="checkbox"
                                                checked={receivers.includes(user.id)}
                                                onChange={() => handleReceiverChange(user.id)}
                                                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="text-sm">
                                                {user.firstname} {user.lastname} ({user.phone})
                                            </span>
                                        </label>
                                    ))
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Tanlangan: {receivers.length} ta foydalanuvchi
                            </p>
                        </div>
                    )}

                    {/* Translations */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Tarjimalar *</label>

                        {translations.map((translation) => (
                            <div key={translation.language} className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-medium text-gray-800 mb-3 capitalize">{translation.language} tili</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Sarlavha *</label>
                                        <input
                                            type="text"
                                            value={translation.title}
                                            onChange={(e) => handleTranslationChange(translation.language, 'title', e.target.value)}
                                            placeholder={`Sarlavha ${translation.language} tilida`}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Tavsif *</label>
                                        <textarea
                                            value={translation.description}
                                            onChange={(e) => handleTranslationChange(translation.language, 'description', e.target.value)}
                                            placeholder={`Tavsif ${translation.language} tilida`}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900 resize-none"
                                            rows={3}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rasm
                        </label>
                        <div
                            className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                                uploading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={handleDivClick}
                        >
                            {previewUrl ? (
                                <div className="mb-4">
                                    <img
                                        src={previewUrl}
                                        alt="Yuklangan rasm"
                                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                                        onError={(e) => {
                                            console.error('Rasm yuklanmadi URL:', previewUrl);
                                            toast.error(`Rasm yuklanmadi: ${previewUrl}`);
                                        }}
                                        onLoad={() => {
                                            console.log('Rasm muvaffaqiyatli yuklandi:', previewUrl);
                                        }}
                                    />
                                    <p className="text-sm text-green-600 mt-2">
                                        Yuklangan rasm
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {uploading ? 'Yangi rasm yuklanmoqda...' : 'Boshqa rasm yuklash uchun bosing'}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <CloudUploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="mt-4 text-sm text-gray-600">
                                        <span className="text-purple-600 hover:text-purple-500 font-medium">
                                            Rasm yuklash
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, JPEG fayllar</p>
                                </div>
                            )}
                            {uploading && (
                                <div className="mt-2">
                                    <CircularProgress size={20} sx={{ color: '#7C6BB3' }} />
                                    <p className="text-xs text-gray-500 mt-1">Yuklanmoqda...</p>
                                </div>
                            )}
                        </div>
                        <input
                            id="file-upload-input"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-700 font-medium rounded border border-gray-300 hover:bg-gray-50"
                            disabled={loading || uploading}
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="px-4 py-2 text-sm text-white font-medium rounded disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
                        >
                            {loading ? 'Yuklanmoqda...' : 'Yuborish'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
