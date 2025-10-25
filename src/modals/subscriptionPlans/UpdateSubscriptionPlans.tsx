'use client';

import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { getAccessToken } from '@/utils/getToken';
import toast from 'react-hot-toast';

interface Props {
    open: boolean;
    onClose: () => void;
    plan: any;
    onSuccess?: () => void;
}

interface Translation {
    language: string;
    title: string;
}

export default function UpdateSubscriptionPlanModal({ open, onClose, plan, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: 1,
        translations: [{ language: 'UZ', title: '' }],
        order: 1,
        price: 0,
        durationDays: 30,
        maxChildren: 1,
        maxTasks: 10,
        maxGifts: 5,
        maxReminders: 3,
        maxMedia: 10,
        freeAfterReferrals: 0,
        psychologicalAdvice: false,
        taskRecommendations: false
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        if (plan) {
            const uzTranslation = plan.translations.find((t: any) => t.language === 'UZ');
            setFormData({
                id: plan.id,
                translations: [{ language: 'UZ', title: uzTranslation?.title || '' }],
                order: plan.order || 1,
                price: plan.price || 0,
                durationDays: plan.durationDays || 30,
                maxChildren: plan.maxChildren || 1,
                maxTasks: plan.maxTasks || 10,
                maxGifts: plan.maxGifts || 5,
                maxReminders: plan.maxReminders || 3,
                maxMedia: plan.maxMedia || 10,
                freeAfterReferrals: plan.freeAfterReferrals || 0,
                psychologicalAdvice: plan.psychologicalAdvice || false,
                taskRecommendations: plan.taskRecommendations || false
            });
        }
    }, [plan]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!plan?.id) return;

        formData.id = plan.id

        // Validatsiya
        if (!formData.translations[0].title.trim()) {
            toast.error('Iltimos, plan nomini kiriting!');
            return;
        }

        if (formData.price < 0) {
            toast.error('Narx manfiy bo\'lishi mumkin emas!');
            return;
        }

        setLoading(true);
        try {
            // 🔥 PATCH so'rovi - faqat o'zgartirilgan maydonlar
            await axios.post(`${baseUrl}/subscription-plans`, formData, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            toast.success('Obuna plani muvaffaqiyatli yangilandi!');
            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error('Update subscription plan error:', error);
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

    const handleTranslationChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            translations: [{ language: 'UZ', title: value }]
        }));
    };

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
                        Obuna Planini Yangilash
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <CloseIcon fontSize="small" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                    {/* Plan nomi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Plan nomi (UZ) *
                        </label>
                        <input
                            type="text"
                            value={formData.translations[0].title}
                            onChange={(e) => handleTranslationChange(e.target.value)}
                            placeholder="Masalan: Premium Plan"
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Narx va muddat */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Narx (so'm)
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                                placeholder="0"
                                min="0"
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Davomiylik (kun)
                            </label>
                            <input
                                type="number"
                                value={formData.durationDays}
                                onChange={(e) => handleInputChange('durationDays', parseInt(e.target.value) || 0)}
                                placeholder="30"
                                min="1"
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Cheklovlar */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Maks. Farzandlar
                            </label>
                            <input
                                type="number"
                                value={formData.maxChildren}
                                onChange={(e) => handleInputChange('maxChildren', parseInt(e.target.value) || 0)}
                                min="1"
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Maks. Vazifalar
                            </label>
                            <input
                                type="number"
                                value={formData.maxTasks}
                                onChange={(e) => handleInputChange('maxTasks', parseInt(e.target.value) || 0)}
                                min="1"
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Maks. Sovg'alar
                            </label>
                            <input
                                type="number"
                                value={formData.maxGifts}
                                onChange={(e) => handleInputChange('maxGifts', parseInt(e.target.value) || 0)}
                                min="0"
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Maks. Eslatmalar
                            </label>
                            <input
                                type="number"
                                value={formData.maxReminders}
                                onChange={(e) => handleInputChange('maxReminders', parseInt(e.target.value) || 0)}
                                min="0"
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Maks. Media
                            </label>
                            <input
                                type="number"
                                value={formData.maxMedia}
                                onChange={(e) => handleInputChange('maxMedia', parseInt(e.target.value) || 0)}
                                min="0"
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bepul takliflar
                            </label>
                            <input
                                type="number"
                                value={formData.freeAfterReferrals}
                                onChange={(e) => handleInputChange('freeAfterReferrals', parseInt(e.target.value) || 0)}
                                min="0"
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Qo'shimcha imkoniyatlar */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Qo'shimcha Imkoniyatlar
                        </label>

                        <div className="flex items-center gap-2">
                            <input
                                id="psychologicalAdvice"
                                type="checkbox"
                                checked={formData.psychologicalAdvice}
                                onChange={(e) => handleInputChange('psychologicalAdvice', e.target.checked)}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <label htmlFor="psychologicalAdvice" className="text-sm text-gray-700">
                                Psixologik maslahat
                            </label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="taskRecommendations"
                                type="checkbox"
                                checked={formData.taskRecommendations}
                                onChange={(e) => handleInputChange('taskRecommendations', e.target.checked)}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <label htmlFor="taskRecommendations" className="text-sm text-gray-700">
                                Vazifa tavsiyalari
                            </label>
                        </div>
                    </div>

                    {/* Order */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tartib raqami
                        </label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                            min="1"
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        />
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
                            {loading ? 'Yangilanmoqda...' : 'Yangilash'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
