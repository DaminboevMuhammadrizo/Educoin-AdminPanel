'use client';

import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { getAccessToken } from '@/utils/getToken';
import toast from 'react-hot-toast';

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface Translation {
    language: string;
    title: string;
    description: string;
}

export default function CreateRecommendationModal({ open, onClose, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        translations: [{ language: 'UZ', title: '', description: '' }],
        fromYear: 0,
        toYear: 0,
        photo: '',
        character: 'HAPPY',
        isActive: true
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validatsiya
        if (!formData.translations[0].title.trim()) {
            toast.error('Iltimos, tavsiya nomini kiriting!');
            return;
        }

        if (!formData.translations[0].description.trim()) {
            toast.error('Iltimos, tavsiya tavsifini kiriting!');
            return;
        }

        if (formData.fromYear < 0 || formData.toYear < 0) {
            toast.error('Yosh manfiy bo\'lishi mumkin emas!');
            return;
        }

        if (formData.toYear > 0 && formData.fromYear > formData.toYear) {
            toast.error('Boshlang\'ich yosh tugash yoshidan katta bo\'lmasligi kerak!');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${baseUrl}/recommendations`, formData, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            toast.success('Yangi tavsiya muvaffaqiyatli yaratildi!');
            onSuccess?.();
            onClose();

            // Formani tozalash
            setFormData({
                translations: [{ language: 'UZ', title: '', description: '' }],
                fromYear: 0,
                toYear: 0,
                photo: '',
                character: 'HAPPY',
                isActive: true
            });
        } catch (error: any) {
            console.error('Create recommendation error:', error);
            toast.error(`❌ Xatolik: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleTranslationChange = (field: 'title' | 'description', value: string) => {
        setFormData(prev => ({
            ...prev,
            translations: [{
                ...prev.translations[0],
                [field]: value
            }]
        }));
    };

    const characterOptions = [
        { value: 'HAPPY', label: 'HAPPY', icon: '😊' },
        { value: 'ANGRY', label: 'ANGRY', icon: '😠' },
        { value: 'QUIET', label: 'QUIET', icon: '🤫' },
        { value: 'SENSITIVE', label: 'SENSITIVE', icon: '🥰' }
    ];

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-full sm:w-[500px] h-full bg-white overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Yangi Tavsiya
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <CloseIcon fontSize="small" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                    {/* Tavsiya nomi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tavsiya nomi (UZ) *
                        </label>
                        <input
                            type="text"
                            value={formData.translations[0].title}
                            onChange={(e) => handleTranslationChange('title', e.target.value)}
                            placeholder="Masalan: Matematika kursi"
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Tavsiya tavsifi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tavsiya tavsifi (UZ) *
                        </label>
                        <textarea
                            value={formData.translations[0].description}
                            onChange={(e) => handleTranslationChange('description', e.target.value)}
                            placeholder="Masalan: Matematika asoslarini o'rganish uchun mukammal kurs"
                            rows={3}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none"
                            required
                        />
                    </div>

                    {/* Yosh oralig'i */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Boshlang'ich yosh
                            </label>
                            <input
                                type="number"
                                value={formData.fromYear}
                                onChange={(e) => handleInputChange('fromYear', parseInt(e.target.value) || 0)}
                                placeholder="0"
                                min="0"
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">0 = cheklov yo'q</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tugash yoshi
                            </label>
                            <input
                                type="number"
                                value={formData.toYear}
                                onChange={(e) => handleInputChange('toYear', parseInt(e.target.value) || 0)}
                                placeholder="0"
                                min="0"
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">0 = cheklov yo'q</p>
                        </div>
                    </div>

                    {/* Rasm URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rasm URL
                        </label>
                        <input
                            type="url"
                            value={formData.photo}
                            onChange={(e) => handleInputChange('photo', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Ixtiyoriy</p>
                    </div>

                    {/* Character */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Xarakter *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {characterOptions.map(option => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleInputChange('character', option.value)}
                                    className={`p-3 border rounded-md text-sm font-medium transition-all ${formData.character === option.value
                                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{option.icon}</span>
                                        <span>{option.label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                        <input
                            id="isActive"
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => handleInputChange('isActive', e.target.checked)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="isActive" className="text-sm text-gray-700">
                            Faol tavsiya
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm rounded-md text-white font-medium shadow transition disabled:opacity-70"
                            style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
                        >
                            {loading ? 'Yaratilmoqda...' : 'Yaratish'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
