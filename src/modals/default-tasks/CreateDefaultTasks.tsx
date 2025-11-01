'use client';

import React, { useState, useEffect } from 'react';
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
    desc: string;
}

export default function CreateDefaultTasksModal({ open, onClose, onSuccess }: Props) {
    const [translations, setTranslations] = useState<Translation[]>([
        { language: 'UZ', title: '', desc: '' },
        { language: 'EN', title: '', desc: '' },
        { language: 'RU', title: '', desc: '' }
    ]);
    const [loading, setLoading] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        if (!open) {
            setTranslations([
                { language: 'UZ', title: '', desc: '' },
                { language: 'EN', title: '', desc: '' },
                { language: 'RU', title: '', desc: '' }
            ]);
        }
    }, [open]);

    const handleTitleChange = (language: string, value: string) => {
        if (value.length <= 32) {
            setTranslations(prev =>
                prev.map(t =>
                    t.language === language ? { ...t, title: value } : t
                )
            );
        }
    };

    const handleDescChange = (language: string, value: string) => {
        if (value.length <= 256) {
            setTranslations(prev =>
                prev.map(t =>
                    t.language === language ? { ...t, desc: value } : t
                )
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emptyTranslation = translations.find(t => !t.title.trim() || !t.desc.trim());
        if (emptyTranslation) {
            toast.error(`Iltimos, barcha maydonlarni to'ldiring!`);
            return;
        }

        setLoading(true);
        try {
            const defaultTaskData = {
                translations: translations.map(t => ({
                    language: t.language,
                    title: t.title.trim(),
                    desc: t.desc.trim(),
                })),
            };

            await axios.post(`${baseUrl}/default-tasks`, defaultTaskData, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            toast.success('Default task yaratildi!');
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
                className="w-full sm:w-[400px] h-full bg-white shadow-xl overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center px-4 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Yangi Vazifa</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded"
                    >
                        <CloseIcon fontSize="small" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Sarlavha</label>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-xs text-gray-500">O'zbekcha (UZ)</p>
                                <p className="text-xs text-gray-500">
                                    {translations.find(t => t.language === 'UZ')?.title.length || 0}/32
                                </p>
                            </div>
                            <input
                                type="text"
                                value={translations.find(t => t.language === 'UZ')?.title || ''}
                                onChange={(e) => handleTitleChange('UZ', e.target.value)}
                                placeholder="O'zbekcha sarlavha"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-xs text-gray-500">English (EN)</p>
                                <p className="text-xs text-gray-500">
                                    {translations.find(t => t.language === 'EN')?.title.length || 0}/32
                                </p>
                            </div>
                            <input
                                type="text"
                                value={translations.find(t => t.language === 'EN')?.title || ''}
                                onChange={(e) => handleTitleChange('EN', e.target.value)}
                                placeholder="English title"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-xs text-gray-500">Русский (RU)</p>
                                <p className="text-xs text-gray-500">
                                    {translations.find(t => t.language === 'RU')?.title.length || 0}/32
                                </p>
                            </div>
                            <input
                                type="text"
                                value={translations.find(t => t.language === 'RU')?.title || ''}
                                onChange={(e) => handleTitleChange('RU', e.target.value)}
                                placeholder="Русский заголовок"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Tavsif</label>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-xs text-gray-500">O'zbekcha (UZ)</p>
                                <p className="text-xs text-gray-500">
                                    {translations.find(t => t.language === 'UZ')?.desc.length || 0}/256
                                </p>
                            </div>
                            <textarea
                                value={translations.find(t => t.language === 'UZ')?.desc || ''}
                                onChange={(e) => handleDescChange('UZ', e.target.value)}
                                placeholder="O'zbekcha tavsif"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900 resize-none"
                                rows={2}
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-xs text-gray-500">English (EN)</p>
                                <p className="text-xs text-gray-500">
                                    {translations.find(t => t.language === 'EN')?.desc.length || 0}/256
                                </p>
                            </div>
                            <textarea
                                value={translations.find(t => t.language === 'EN')?.desc || ''}
                                onChange={(e) => handleDescChange('EN', e.target.value)}
                                placeholder="English description"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900 resize-none"
                                rows={2}
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-xs text-gray-500">Русский (RU)</p>
                                <p className="text-xs text-gray-500">
                                    {translations.find(t => t.language === 'RU')?.desc.length || 0}/256
                                </p>
                            </div>
                            <textarea
                                value={translations.find(t => t.language === 'RU')?.desc || ''}
                                onChange={(e) => handleDescChange('RU', e.target.value)}
                                placeholder="Русское описание"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900 resize-none"
                                rows={2}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-700 font-medium rounded border border-gray-300 hover:bg-gray-50"
                            disabled={loading}
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm text-white font-medium rounded disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
                        >
                            {loading ? 'Yuklanmoqda...' : 'Saqlash'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
