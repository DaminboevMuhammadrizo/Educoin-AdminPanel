'use client';

import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { getAccessToken } from '@/utils/getToken';
import toast from 'react-hot-toast';

interface Translation {
    language: string;
    title: string;
    desc: string;
}

interface DefaultTask {
    id: string;
    translations: Translation[];
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    defaultTask: DefaultTask | null;
}

export default function UpdateDefaultTasksModal({ open, onClose, onSuccess, defaultTask }: Props) {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        if (open && defaultTask) {
            const uzTranslation = defaultTask.translations.find(t => t.language === 'UZ');
            setTitle(uzTranslation?.title || '');
            setDesc(uzTranslation?.desc || '');
        } else if (!open) {
            setTitle('');
            setDesc('');
        }
    }, [open, defaultTask]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 32) {
            setTitle(value);
        }
    };

    const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= 256) {
            setDesc(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !desc.trim()) {
            toast.error('Iltimos, barcha maydonlarni to\'ldiring!');
            return;
        }

        if (!defaultTask?.id) {
            toast.error('ID topilmadi!');
            return;
        }

        setLoading(true);
        try {
            const updateData = {
                translations: [
                    {
                        language: 'UZ',
                        title: title.trim(),
                        desc: desc.trim(),
                    },
                ],
            };

            await axios.patch(`${baseUrl}/default-tasks/${defaultTask.id}`, updateData, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            toast.success('Default task yangilandi!');
            onSuccess?.();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!open || !defaultTask) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
            <div
                className="w-full sm:w-[450px] h-full bg-white shadow-xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Tahrirlash</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    >
                        <CloseIcon fontSize="small" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                    {/* Title input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sarlavha
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Vazifa nomini kiriting"
                            className="w-full border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg px-4 py-2.5 text-sm transition-all outline-none"
                            required
                        />
                        <div className="flex justify-between items-center mt-1.5">
                            <p className="text-xs text-gray-500">UZ tilida</p>
                            <p className="text-xs text-gray-500">
                                {title.length}/32
                            </p>
                        </div>
                    </div>

                    {/* Description input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tavsif
                        </label>
                        <textarea
                            value={desc}
                            onChange={handleDescChange}
                            placeholder="Vazifa haqida batafsil ma'lumot"
                            className="w-full border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg px-4 py-2.5 text-sm transition-all outline-none resize-none"
                            rows={6}
                            required
                        />
                        <div className="flex justify-between items-center mt-1.5">
                            <p className="text-xs text-gray-500">Batafsil yozing</p>
                            <p className="text-xs text-gray-500">
                                {desc.length}/256
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Yuklanmoqda...' : 'Yangilash'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
