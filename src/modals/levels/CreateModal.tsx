// modals/levels/CreateLevelModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { getAccessToken } from '../../utils/getToken';
import toast from 'react-hot-toast';

interface CreateLevelModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface TranslationForm {
    language: string;
    title: string;
    subTitle: string;
    description: string;
}

export default function CreateLevelModal({ open, onClose, onSuccess }: CreateLevelModalProps) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        order: 1,
        coins: 0,
        color: 'FF0000' // Default red color without #
    });

    const [translations, setTranslations] = useState<TranslationForm[]>([
        { language: 'UZ', title: '', subTitle: '', description: '' },
        { language: 'EN', title: '', subTitle: '', description: '' },
        { language: 'RU', title: '', subTitle: '', description: '' }
    ]);

    useEffect(() => {
        if (!open) {
            setFormData({
                order: 1,
                coins: 0,
                color: 'FF0000'
            });
            setTranslations([
                { language: 'UZ', title: '', subTitle: '', description: '' },
                { language: 'EN', title: '', subTitle: '', description: '' },
                { language: 'RU', title: '', subTitle: '', description: '' }
            ]);
        }
    }, [open]);

    // Hex formatni tekshirish
    const isValidHex = (color: string): boolean => {
        return /^[0-9A-Fa-f]{6}$/.test(color);
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleColorChange = (value: string) => {
        // Agar # bilan kiritilgan bo'lsa, # ni olib tashlaymiz
        const cleanColor = value.startsWith('#') ? value.slice(1) : value;
        setFormData(prev => ({
            ...prev,
            color: cleanColor
        }));
    };

    const handleTranslationChange = (index: number, field: string, value: string) => {
        const newTranslations = [...translations];
        newTranslations[index] = {
            ...newTranslations[index],
            [field]: value
        };
        setTranslations(newTranslations);
    };

    const getTranslationValue = (language: string, field: string) => {
        const translation = translations.find(t => t.language === language);
        return translation ? translation[field as keyof TranslationForm] as string : '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        for (const translation of translations) {
            if (!translation.title.trim() || !translation.subTitle.trim() || !translation.description.trim()) {
                toast.error(`Barcha ${translation.language} maydonlarni to'ldiring`);
                return;
            }
        }

        if (formData.order < 1) {
            toast.error('Tartib raqami 1 dan kichik boʻlmasligi kerak');
            return;
        }

        if (formData.coins < 0) {
            toast.error('Coinlar soni manfiy boʻlmasligi kerak');
            return;
        }

        // Rang validatsiyasi
        if (!isValidHex(formData.color)) {
            toast.error('Rang notoʻgʻri formatda. Faqat 6 ta raqam/harf boʻlishi kerak (masalan: FF0000)');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...formData,
                translations
            };

            await axios.post(`${baseUrl}/levels`, payload, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'application/json'
                },
            });

            toast.success('Daraja muvaffaqiyatli qoʻshildi');
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    // Color input uchun # bilan qiymat
    const getColorInputValue = () => {
        return `#${formData.color}`;
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
            <div className="w-full sm:w-[500px] h-full bg-white overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
                    <h2 className="text-lg font-semibold text-gray-800">Yangi daraja qoʻshish</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/50 rounded-full transition-colors"
                    >
                        <CloseIcon fontSize="small" className="text-gray-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-6">
                    {/* Asosiy ma'lumotlar */}
                    <div className="space-y-4">
                        <h3 className="text-md font-medium text-gray-800 border-l-4 border-purple-500 pl-3">Asosiy ma'lumotlar</h3>

                        <div className="grid grid-cols-1 gap-4">
                            {/* Tartib raqami */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <label className="block text-sm font-medium mb-2 text-gray-700">Tartib raqami *</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                                    min="1"
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            {/* Coinlar soni */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <label className="block text-sm font-medium mb-2 text-gray-700">Coinlar soni *</label>
                                <input
                                    type="number"
                                    value={formData.coins}
                                    onChange={(e) => handleInputChange('coins', parseInt(e.target.value) || 0)}
                                    min="0"
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            {/* Rang tanlash */}
                            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300">
                                <label className="block text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                    </svg>
                                    Rang tanlash
                                </label>

                                <div className="flex items-center gap-3">
                                    {/* Rang tanlash inputi */}
                                    <div className="relative group">
                                        <input
                                            type="color"
                                            value={getColorInputValue()}
                                            onChange={(e) => handleColorChange(e.target.value)}
                                            className="w-14 h-14 rounded-lg border border-gray-200 cursor-pointer shadow-sm hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/30 to-transparent pointer-events-none"></div>
                                    </div>

                                    {/* Rang kodi va namuna */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 font-mono text-sm">#</span>
                                            <input
                                                type="text"
                                                value={formData.color}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^0-9A-Fa-f]/g, '');
                                                    if (value.length <= 6) handleColorChange(value);
                                                }}
                                                placeholder="FF0000"
                                                className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm font-mono uppercase focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all tracking-wider"
                                                maxLength={6}
                                            />
                                            <div
                                                className="w-8 h-8 rounded-md border border-gray-200 shadow-sm"
                                                style={{ backgroundColor: `#${formData.color}` }}
                                            ></div>
                                        </div>

                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Faqat: 0-9, A-F</span>
                                            <span className={`${formData.color.length === 6 ? 'text-green-600' : 'text-orange-500'}`}>
                                                {formData.color.length}/6
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Tarjimalar */}
                    <div className="space-y-4">
                        <h3 className="text-md font-medium text-gray-800 border-l-4 border-blue-500 pl-3">Tarjimalar</h3>

                        {translations.map((translation, index) => (
                            <div key={translation.language} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="text-sm font-medium text-gray-700 mb-3 capitalize flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${translation.language === 'UZ' ? 'bg-green-500' :
                                            translation.language === 'EN' ? 'bg-blue-500' :
                                                'bg-red-500'
                                        }`}></span>
                                    {translation.language} tili
                                </h4>

                                <div className="space-y-3">
                                    {/* Nomi */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Nomi *</label>
                                        <input
                                            type="text"
                                            value={getTranslationValue(translation.language, 'title')}
                                            onChange={(e) => handleTranslationChange(index, 'title', e.target.value)}
                                            placeholder={`${translation.language} nomi`}
                                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Sub Title */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Sub Title *</label>
                                        <input
                                            type="text"
                                            value={getTranslationValue(translation.language, 'subTitle')}
                                            onChange={(e) => handleTranslationChange(index, 'subTitle', e.target.value)}
                                            placeholder={`${translation.language} sub title`}
                                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Tavsif */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Tavsif *</label>
                                        <textarea
                                            value={getTranslationValue(translation.language, 'description')}
                                            onChange={(e) => handleTranslationChange(index, 'description', e.target.value)}
                                            placeholder={`${translation.language} tavsifi`}
                                            rows={3}
                                            className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 font-medium shadow-sm hover:shadow-md"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 text-white rounded-xl transition-all duration-200 disabled:opacity-50 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Yuklanmoqda...</span>
                                </div>
                            ) : (
                                'Qoʻshish'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
